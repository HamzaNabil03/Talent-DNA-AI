<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends VerifyEmail
{
    public function toMail($notifiable): MailMessage
    {
        $arabic = app()->getLocale() === 'ar';

        return (new MailMessage)
            ->subject($arabic ? 'فعّل بريدك في Talent DNA AI' : 'Verify your Talent DNA AI email')
            ->line($arabic ? 'استخدم الرابط التالي لتفعيل بريدك. الرابط صالح لمدة 60 دقيقة.' : 'Use the link below to verify your email. The link is valid for 60 minutes.')
            ->action($arabic ? 'تفعيل البريد' : 'Verify email', $this->verificationUrl($notifiable))
            ->line($arabic ? 'إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل الرسالة.' : 'If you did not create this account, you can ignore this message.');
    }
}
