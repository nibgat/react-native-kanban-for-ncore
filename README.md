# React Native Kanban
Kanban and Calendar for NCore Mobile

https://user-images.githubusercontent.com/17149305/198445922-cec7d3f4-39ee-47d4-86a3-ae474b4b491c.mp4

### Requirements
* [NCore Mobile Package](https://github.com/nibgat/ncore-mobile.git)

### Installation
```
yarn add react-native-kanban-for-ncore
```

### Usage
```javascript
import React from "react";
import {
    View
} from "react-native";
import {
    useNCoreLocalization,
    useNCoreTheme,
    PageContainer,
    Text
} from "ncore-mobile";
import Kanban from "react-native-kanban-for-ncore";

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

const Home = () => {
    const {
        spaces
    } = useNCoreTheme();
    const {
        localize
    } = useNCoreLocalization();

    return <PageContainer
        scrollable={false}
    >
        <Kanban
            outerVerticalSpacing={spaces.container * 1.5}
            data={TYPE === "kanban" ? MOCK_DATA_FOR_COLUMN_WITH_KANBAN : MOCK_DATA_FOR_COLUMN_WITH_CALENDAR}
            titlesOfRows={TYPE === "kanban" ? undefined : MOCK_DATA_FOR_ROWS}
            type={TYPE}
            renderItem={({
                item,
                index
            }) => {
                return <View
                    style={[
                        {
                            backgroundColor: item.bgColor
                        },
                        stylesheet.item
                    ]}
                >
                    <Text>
                        {item.title}
                    </Text>
                </View>;
            }}
        />
    </PageContainer>;
};
export default Home;
```
