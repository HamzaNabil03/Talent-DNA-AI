<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    public function toMail($notifiable): MailMessage
    {
        $arabic = app()->getLocale() === 'ar';
        $url = rtrim((string) config('app.frontend_url'), '/').'/auth/reset-password?token='.urlencode($this->token).'&email='.urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject($arabic ? 'إعادة تعيين كلمة مرور Talent DNA AI' : 'Reset your Talent DNA AI password')
            ->line($arabic ? 'استخدم الرابط التالي لإعادة تعيين كلمة المرور. الرابط صالح لمدة 60 دقيقة.' : 'Use the link below to reset your password. The link is valid for 60 minutes.')
            ->action($arabic ? 'إعادة تعيين كلمة المرور' : 'Reset password', $url)
            ->line($arabic ? 'إذا لم تطلب إعادة التعيين، يمكنك تجاهل الرسالة.' : 'If you did not request a password reset, you can ignore this message.');
    }
}
