import { EnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

/**
 * PrimeNG-specific providers.
 * This function returns an EnvironmentProviders of Angular providers required for PrimeNG components and services.
 */
export const customProvidePrimeNG = (): EnvironmentProviders => {
    return providePrimeNG({
        ripple: true, 
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: 'light',
            }
        }
    });
};