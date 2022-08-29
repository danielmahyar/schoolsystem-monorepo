export interface BaseColorStruct {
    dark: string;
    light: string;

    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;

    textPrimary: string;
    textSecondary: string;

    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    lightDark: string;
}

export const DarkColors: BaseColorStruct = {
    lightDark: '#2F3136',
    dark: '#202225',
    background: '#2F3136',
    card: '#2F3136',
    text: '#fff',
    border: '#2F3136',
    notification: '#2F3136',
    light: '#36393F',
    textPrimary: '#FFFFFF',
    textSecondary: '#A9A9A9',
    primary: '#5456FF',
    secondary: '#2F3136',
    success: '#2F3136',
    warning: '#2F3136',
    danger: '#2F3136',
}

export const LightColors: BaseColorStruct = {
    dark: '#FFFFFF',
    lightDark: '#202225',
    light: '#FFFFFF',
    background: '#FFFFFF',
    card: '#2F3136',
    text: '#2F3136',
    border: '#2F3136',
    notification: '#2F3136',
    textPrimary: 'black',
    textSecondary: '#A9A9A9',
    primary: '#5456FF',
    secondary: '#FFFFFF',
    success: '#FFFFFF',
    warning: '#FFFFFF',
    danger: '#FFFFFF',
}
