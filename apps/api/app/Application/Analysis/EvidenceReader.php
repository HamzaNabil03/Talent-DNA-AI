<?php

namespace App\Application\Analysis;

use App\Models\Evidence;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Smalot\PdfParser\Parser;
use ZipArchive;

final class EvidenceReader
{
    /** @return array{source_type:string,text:?string,reference_map:array<string,mixed>,provider_part:?array<string,mixed>,partial:bool} */
    public function read(Evidence $evidence): array
    {
        if ($evidence->type !== 'file' || ! $evidence->storage_disk || ! $evidence->storage_path) {
            throw new RuntimeException('Only uploaded private files can be analyzed. Saved links are never fetched.');
        }
        $disk = Storage::disk($evidence->storage_disk);
        if (! $disk->exists($evidence->storage_path)) {
            throw new RuntimeException('The private evidence file is missing.');
        }
        $bytes = $disk->get($evidence->storage_path);
        if ($bytes === '') {
            throw new RuntimeException('The evidence file is empty.');
        }
        $extension = strtolower(pathinfo((string) $evidence->original_filename, PATHINFO_EXTENSION));
        if (in_array($extension, ['txt', 'html', 'htm', 'css', 'js'], true)) {
            return $this->text($bytes, $extension);
        }
        if ($extension === 'docx') {
            return $this->docx($bytes);
        }
        if ($extension === 'pdf') {
            return $this->pdf($bytes);
        }
        if (in_array($extension, ['jpg', 'jpeg', 'png'], true)) {
            return $this->visual($bytes, $evidence->mime_type ?: ($extension === 'png' ? 'image/png' : 'image/jpeg'), 'image');
        }
        throw new RuntimeException('This file format is not supported for analysis.');
    }

    /** @return array{source_type:string,text:string,reference_map:array{kind:string,max:int},provider_part:null,partial:bool} */
    private function text(string $bytes, string $extension): array
    {
        if (str_contains($bytes, "\0") || ! mb_check_encoding($bytes, 'UTF-8')) {
            throw new RuntimeException('The text file is corrupt or is not valid UTF-8.');
        }
        $lines = preg_split('/\R/u', $bytes) ?: [];
        $numbered = array_map(static fn (string $line, int $index): string => sprintf('L%d: %s', $index + 1, $line), $lines, array_keys($lines));
        [$text, $partial] = $this->truncate(implode("\n", $numbered));

        return ['source_type' => $extension, 'text' => $text, 'reference_map' => ['kind' => 'line', 'max' => count($lines)], 'provider_part' => null, 'partial' => $partial];
    }

    /** @return array{source_type:string,text:string,reference_map:array{kind:string,max:int},provider_part:null,partial:bool} */
    private function docx(string $bytes): array
    {
        $path = tempnam(sys_get_temp_dir(), 'tdna-docx-');
        if (! is_string($path)) {
            throw new RuntimeException('The DOCX file could not be opened safely.');
        }
        file_put_contents($path, $bytes);
        $zip = new ZipArchive;
        try {
            if ($zip->open($path) !== true) {
                throw new RuntimeException('The DOCX file is corrupt or encrypted.');
            }
            $xml = $zip->getFromName('word/document.xml');
            if (! is_string($xml)) {
                throw new RuntimeException('The DOCX document body is missing.');
            }
            $document = new \DOMDocument;
            if (! @$document->loadXML($xml, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING)) {
                throw new RuntimeException('The DOCX document body is invalid.');
            }
            $xpath = new \DOMXPath($document);
            $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
            $paragraphs = [];
            foreach ($xpath->query('//w:p') ?: [] as $paragraph) {
                $nodes = $xpath->query('.//w:t', $paragraph);
                $value = trim($nodes ? implode('', array_map(static fn ($node): string => $node->textContent, iterator_to_array($nodes))) : '');
                if ($value !== '') {
                    $paragraphs[] = sprintf('P%d: %s', count($paragraphs) + 1, $value);
                }
            }
            if ($paragraphs === []) {
                throw new RuntimeException('The DOCX file contains no readable paragraphs.');
            }
            [$text, $partial] = $this->truncate(implode("\n", $paragraphs));

            return ['source_type' => 'docx', 'text' => $text, 'reference_map' => ['kind' => 'paragraph', 'max' => count($paragraphs)], 'provider_part' => null, 'partial' => $partial];
        } finally {
            if ($zip->status === ZipArchive::ER_OK) {
                $zip->close();
            }
            @unlink($path);
        }
    }

    /** @return array{source_type:string,text:?string,reference_map:array{kind:string,max:int},provider_part:?array<string,string>,partial:bool} */
    private function pdf(string $bytes): array
    {
        try {
            $pages = (new Parser)->parseContent($bytes)->getPages();
        } catch (\Throwable) {
            throw new RuntimeException('The PDF is corrupt, encrypted, or unreadable.');
        }
        $maxPages = (int) config('evidence.analysis.max_pdf_pages');
        $pageText = [];
        foreach (array_slice($pages, 0, $maxPages) as $index => $page) {
            $value = trim($page->getText());
            if ($value !== '') {
                $pageText[] = sprintf("PAGE %d:\n%s", $index + 1, $value);
            }
        }
        $partial = count($pages) > $maxPages;
        if ($pageText !== []) {
            [$text, $truncated] = $this->truncate(implode("\n\n", $pageText));

            return ['source_type' => 'pdf_text', 'text' => $text, 'reference_map' => ['kind' => 'page', 'max' => count($pages)], 'provider_part' => null, 'partial' => $partial || $truncated];
        }
        $visual = $this->visual($bytes, 'application/pdf', 'scanned_pdf');
        $visual['reference_map'] = ['kind' => 'page_visual', 'max' => max(1, min(count($pages), $maxPages))];
        $visual['partial'] = $partial;

        return $visual;
    }

    /** @return array{source_type:string,text:null,reference_map:array{kind:string,max:int},provider_part:array<string,string>,partial:bool} */
    private function visual(string $bytes, string $mimeType, string $type): array
    {
        return ['source_type' => $type, 'text' => null, 'reference_map' => ['kind' => 'visual', 'max' => 1], 'provider_part' => ['type' => $type === 'image' ? 'image' : 'document', 'data' => base64_encode($bytes), 'mime_type' => $mimeType], 'partial' => false];
    }

    /** @return array{0:string,1:bool} */
    private function truncate(string $text): array
    {
        $limit = (int) config('evidence.analysis.max_text_characters_per_file');

        return mb_strlen($text) > $limit ? [mb_substr($text, 0, $limit), true] : [$text, false];
    }
}
