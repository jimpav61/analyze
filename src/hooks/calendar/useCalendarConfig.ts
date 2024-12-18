interface CalendarUiConfig {
  theme?: 'light' | 'dark';
  styles?: {
    branding?: {
      brandColor?: string;
    };
  };
  hideEventTypeDetails?: boolean;
}

interface PrefillAndIframeAttrsConfig {
  [key: string]: string | string[] | Record<string, string>;
}

interface CalendarInlineConfig {
  elementOrSelector: string;
  calLink: string;
  config?: {
    hideEventTypeDetails?: boolean;
  };
}

export const useCalendarConfig = () => {
  const getUiConfig = (): CalendarUiConfig => ({
    theme: 'light',
    styles: { branding: { brandColor: '#000000' } },
    hideEventTypeDetails: false,
  });

  const getInlineConfig = (calLink: string): CalendarInlineConfig => ({
    elementOrSelector: '#cal-booking-placeholder',
    calLink,
    config: {
      hideEventTypeDetails: false
    }
  });

  return {
    getUiConfig,
    getInlineConfig
  };
};