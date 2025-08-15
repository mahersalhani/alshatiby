'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordUpdateData, useEmployeeSchemas } from '@/lib/schemas/employee';

interface PasswordUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PasswordUpdateData) => void;
  isLoading?: boolean;
}

export function PasswordUpdateModal({ open, onOpenChange, onSubmit, isLoading = false }: PasswordUpdateModalProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = useTranslations('PasswordModal');
  const locale = useLocale();
  const { passwordUpdateSchema } = useEmployeeSchemas();

  const form = useForm<PasswordUpdateData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: PasswordUpdateData) => {
    onSubmit(data);
    form.reset();
  };

  const isRTL = locale === 'ar';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('updatePasswordTitle')}</DialogTitle>
          <DialogDescription>{t('updatePasswordDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newPassword')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        size="lg"
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={t('enterNewPassword')}
                        className={isRTL ? 'pr-10 text-right' : 'pr-10'}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      disabled={isLoading}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmNewPassword')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        size="lg"
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('confirmNewPasswordPlaceholder')}
                        className={isRTL ? 'pr-10 text-right' : 'pr-10'}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                color="destructive"
                variant={'soft'}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} variant={'soft'} color="primary">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('updatingPassword')}
                  </>
                ) : (
                  t('updatePassword')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
