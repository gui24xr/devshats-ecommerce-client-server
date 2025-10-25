export interface Category {
    id: string;
    name: string;
    displayOrder: number;
    slug: string;
    itemsCount?: number | null;
    label: string;
    emoji?: string;
}
