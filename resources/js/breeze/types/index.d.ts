import { Map } from '@/store/map'

export interface LaravelUser {
    // Laravel
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
    // Project Map
    maps: Map[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: LaravelUser;
    };
};
