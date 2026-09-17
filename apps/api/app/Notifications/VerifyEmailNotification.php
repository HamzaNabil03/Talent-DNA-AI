<?php

namespace App\Notifications;

use App\Notifications\Channels\BrevoChannel;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends VerifyEmail
{
    /** @return array<int, string> */
    public function via($notifiable)
    {
        return config('services.brevo.key') ? [BrevoChannel::class] : ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $arabic = app()->getLocale() === 'ar';

        return (new MailMessage)
            ->subject($arabic ? 'فعّل بريدك في Talent DNA AI' : 'Verify your Talent DNA AI email')
            ->line($arabic ? 'استخدم الرابط التالي لتفعيل بريدك. الرابط صالح لمدة 60 دقيقة.' : 'Use the link below to verify your email. The link is valid for 60 minutes.')
            ->action($arabic ? 'تفعيل البريد' : 'Verify email', $this->verificationUrl($notifiable))
            ->line($arabic ? 'إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل الرسالة.' : 'If you did not create this account, you can ignore this message.');
    }

    /** @return array<string, mixed> */
    public function toBrevo(object $notifiable): array
    {
        $arabic = app()->getLocale() === 'ar';
        $url = $this->verificationUrl($notifiable);
        $subject = $arabic ? 'فعّل بريدك في Talent DNA AI' : 'Verify your Talent DNA AI email';
        $intro = $arabic
            ? 'استخدم الرابط التالي لتفعيل بريدك. الرابط صالح لمدة 60 دقيقة.'
            : 'Use the link below to verify your email. The link is valid for 60 minutes.';
        $button = $arabic ? 'تفعيل البريد' : 'Verify email';
        $outro = $arabic
            ? 'إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل الرسالة.'
            : 'If you did not create this account, you can ignore this message.';

        return [
            'sender' => [
                'email' => (string) config('mail.from.address'),
                'name' => (string) config('mail.from.name'),
            ],
            'to' => [[
                'email' => (string) $notifiable->getEmailForVerification(),
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
}
