<?php

namespace App\Notifications;

use App\Notifications\Channels\BrevoChannel;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return config('services.brevo.key') ? [BrevoChannel::class] : ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $arabic = app()->getLocale() === 'ar';
        $url = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject($arabic ? 'إعادة تعيين كلمة مرور Talent DNA AI' : 'Reset your Talent DNA AI password')
            ->line($arabic ? 'استخدم الرابط التالي لإعادة تعيين كلمة المرور. الرابط صالح لمدة 60 دقيقة.' : 'Use the link below to reset your password. The link is valid for 60 minutes.')
            ->action($arabic ? 'إعادة تعيين كلمة المرور' : 'Reset password', $url)
            ->line($arabic ? 'إذا لم تطلب إعادة التعيين، يمكنك تجاهل الرسالة.' : 'If you did not request a password reset, you can ignore this message.');
    }

    /** @return array<string, mixed> */
    public function toBrevo(object $notifiable): array
    {
        $arabic = app()->getLocale() === 'ar';
        $url = $this->resetUrl($notifiable);
        $subject = $arabic ? 'إعادة تعيين كلمة مرور Talent DNA AI' : 'Reset your Talent DNA AI password';
        $intro = $arabic
            ? 'استخدم الرابط التالي لإعادة تعيين كلمة المرور. الرابط صالح لمدة 60 دقيقة.'
            : 'Use the link below to reset your password. The link is valid for 60 minutes.';
        $button = $arabic ? 'إعادة تعيين كلمة المرور' : 'Reset password';
        $outro = $arabic
            ? 'إذا لم تطلب إعادة التعيين، يمكنك تجاهل الرسالة.'
            : 'If you did not request a password reset, you can ignore this message.';

        return [
            'sender' => [
                'email' => (string) config('mail.from.address'),
                'name' => (string) config('mail.from.name'),
            ],
            'to' => [[
                'email' => (string) $notifiable->getEmailForPasswordReset(),
                'name' => (string) ($notifiable->name ?? ''),
            ]],
            'subject' => $subject,
            'htmlContent' => sprintf(
                '<html><body dir="%s" style="font-family:Arial,sans-serif;line-height:1.7"><h2>Talent DNA AI</h2><p>%s</p><p><a href="%s" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px">%s</a></p><p>%s</p></body></html>',
                $arabic ? 'rtl' : 'ltr',
                e($intro),
                e($url),
                e($button),
                e($outro),
            ),
        ];
    }

    private function resetUrl(object $notifiable): string
    {
        return rtrim((string) config('app.frontend_url'), '/').'/auth/reset-password?token='.urlencode($this->token).'&email='.urlencode((string) $notifiable->getEmailForPasswordReset());
    }
}
