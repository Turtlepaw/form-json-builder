export type ColorString = `#${string}` | number;

export interface EmbedAuthor {
    name: string;
    url: string;
    icon_url: string;
}

export interface EmbedFooter {
    text: string;
    icon_url: string;
}

export interface EmbedBuilder {
    title: string;
    description: string;
    author: EmbedAuthor;
    footer: EmbedFooter;
    color: ColorString;
}

export interface FormMessageBuilder {
    content: string | null;
    embeds: EmbedBuilder[];
}

export interface ButtonBuilder {
    label: string;
    style: number;
}

export interface SelectMenuBuilder {
    description: string;
    label: string;
}

export interface ModalComponentBuilder {
    type: number;
    label: string;
    style: number;
    placeholder: string;
    value: string;
    min_length: number;
    max_length: number;
    required: boolean;
}

export interface ModalActionRowBuilder {
    type: number;
    components: ModalComponentBuilder[];
}

export interface ModalBuilder {
    title: string;
    components: ModalActionRowBuilder[];
}

export interface FormBuilder {
    webhook_url: string;
    button: ButtonBuilder;
    select_menu_option?: SelectMenuBuilder;
    modal: ModalBuilder;
}

export interface FormAndMessageBuilder {
    message: FormMessageBuilder;
    forms: FormBuilder[];
}

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
    avatarURL: string;
    guilds: (any | undefined)[] | null;
}