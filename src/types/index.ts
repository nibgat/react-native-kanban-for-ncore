import {
    ReactElement
} from "react";

export interface IKanbanProps<
    T,
    F extends {
        id: string;
        title: string;
        rows: Array<Record<string, T>>;
    },
    S extends {
        id: string;
        title: string;
        rows: Record<string, T>;
    },
    P,
    L extends Record<string, P>
> {
    kanbanEmptyRowCount: number;
    customSpacing: number;
    customWidth: number;
    isDraggable: boolean;
    titleContainerStyle: any;
    type: "kanban" | "calendar";
    renderColumnTitle: (props: { item: F, index: number }) => ReactElement;
    titlesOfRows: L;
    renderTitlesColumnTitle: (props: { item: P, index: number }) => ReactElement;
    renderItem: (props: { item: T, index: number }) => ReactElement;
    onChanged: (props: any) => void;
    kanbanData: Array<F>;
    calendarData: Array<S>;
};
