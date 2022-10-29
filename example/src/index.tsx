// @ts-nocheck
import * as React from "react";

import {
    StyleSheet, View, Text 
} from "react-native";
import Kanban from "react-native-kanban-for-ncore";
import {
    uuid 
} from "./utils";
import {
    GestureHandlerRootView
} from "react-native-gesture-handler";
import {
    NCoreProvider, useNCoreTheme
} from "ncore-mobile";

const MOCK_DATA_FOR_ROWS = {
    "07:00": {
        title: "07:00"
    },
    "07:15": {
        title: "07:15"
    },
    "07:30": {
        title: "07:30"
    },
    "07:45": {
        title: "07:45"
    },
    "08:00": {
        title: "08:00"
    },
    "08:15": {
        title: "08:15"
    },
    "08:30": {
        title: "08:30"
    },
    "08:45": {
        title: "08:45"
    },
    "09:00": {
        title: "09:00"
    }
};

const MOCK_DATA_FOR_COLUMN_WITH_CALENDAR = [
    {
        id: uuid(),
        title: "Column 1",
        rows: {
            "07:00": {
                id: uuid(),
                title: "Column 1 - Row 1",
                bgColor: "#00c2a9"
            },
            "07:15": {
                id: uuid(),
                title: "Column 1 - Row 2",
                bgColor: "white"
            },
            "07:45": {
                id: uuid(),
                title: "Column 1 - Row 4",
                bgColor: "violet"
            }
        }
    },
    {
        id: uuid(),
        title: "Column 2",
        rows: {
            "07:00": {
                id: uuid(),
                title: "Column 2 - Row 1",
                bgColor: "red"
            },
            "07:15": {
                id: uuid(),
                title: "Column 2 - Row 2",
                bgColor: "blue"
            }
        }
    },
    {
        id: uuid(),
        title: "Column 3",
        rows: {
            "07:00": {
                id: uuid(),
                title: "Column 4 - Row 1",
                bgColor: "purple"
            },
            "07:15": {
                id: uuid(),
                title: "Column 4 - Row 2",
                bgColor: "pink"
            }
        }
    },
    {
        id: uuid(),
        title: "Column 4",
        rows: {
            "07:00": {
                id: uuid(),
                title: "Column 3 - Row 1",
                bgColor: "yellow"
            },
            "07:15": {
                id: uuid(),
                title: "Column 3 - Row 2",
                bgColor: "navi"
            }
        }
    }
];

const MOCK_DATA_FOR_COLUMN_WITH_KANBAN = [
    {
        id: uuid(),
        title: "Column 1",
        rows: [
            {
                id: uuid(),
                title: "07:00",
                bgColor: "#00c2a9"
            },
            {
                id: uuid(),
                title: "07:15",
                bgColor: "white"
            }
        ]
    },
    {
        id: uuid(),
        title: "Column 2",
        rows: [
            {
                id: uuid(),
                title: "07:00",
                bgColor: "orange"
            },
            {
                id: uuid(),
                title: "07:15",
                bgColor: "purple"
            }
        ]
    },
    {
        id: uuid(),
        title: "Column 3",
        rows: [
            {
                id: uuid(),
                title: "07:00",
                bgColor: "navy"
            },
            {
                id: uuid(),
                title: "07:15",
                bgColor: "brown"
            }
        ]
    },
    {
        id: uuid(),
        title: "Column 4",
        rows: [
            {
                id: uuid(),
                title: "07:00",
                bgColor: "teal"
            },
            {
                id: uuid(),
                title: "07:15",
                bgColor: "grey"
            }
        ]
    }
];

const TYPE = "calendar";

const AppContext = () => {
    const {
        spaces
    } = useNCoreTheme();
    return <View style={styles.container}>
        <Kanban
            outerVerticalSpacing={spaces.container * 1.5}
            data={TYPE === "kanban" ? MOCK_DATA_FOR_COLUMN_WITH_KANBAN : MOCK_DATA_FOR_COLUMN_WITH_CALENDAR}
            titlesOfRows={TYPE === "kanban" ? undefined : MOCK_DATA_FOR_ROWS}
            type={TYPE}
            renderItem={({
                item
            }) => {
                return <View
                    style={[
                        {
                            backgroundColor: item.bgColor,
                            height: "100%"
                        }
                    ]}
                >
                    <Text>
                        {item.title}
                    </Text>
                </View>;
            }}
        />
    </View>;
};

export default function App() {
    return <GestureHandlerRootView
        style={{
            flex: 1
        }}
    >
        <NCoreProvider
            config={{
                initialThemeKey: "dark"
            }}
        >
            <AppContext/>
        </NCoreProvider>
    </GestureHandlerRootView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
