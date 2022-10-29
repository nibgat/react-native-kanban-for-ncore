// @ts-nocheck
import React, {
    useEffect,
    useState,
    useRef
} from "react";
import {
    ScrollView,
    FlatList,
    Animated,
    View
} from "react-native";
import stylesheet from "./stylesheet";
import {
    useNCoreTheme,
    Text
} from "ncore-mobile";
import Column from "./components/column";
import {
    uuid
} from "./utils";
import {
    windowWidth 
} from "./constants";

export const firstColumn = (windowWidth * 30) / 100;

const Kanban = ({
    kanbanEmptyRowCount = 6,
    customSpacing,
    customWidth,
    isDraggable = true,
    titleContainerStyle,
    type = "kanban",
    renderTitle,
    titlesOfRows,
    renderTitles,
    renderItem,
    onChanged,
    data
}) => {
    const {
        spaces
    } = useNCoreTheme();

    const [columns, setColumns] = useState(data.map(p => {
        if(type === "kanban") {
            return {
                ...p,
                rows: p.rows.map(c => {
                    return {
                        ...c,
                        __key: uuid()
                    };
                })
            };
        } else {
            let newP = {
                ...p,
                rows:{
                }
            };
            Object.keys(p.rows).forEach(c => {
                newP.rows[c] = {
                    ...p.rows[c],
                    __key: uuid()
                };
            });
            return newP;
        }
    }));
    const [rows, setRows] = useState([]);

    const verticalScrollRef = useRef();
    const horizontalScrollRef = useRef();

    const x = useRef(new Animated.Value(0)).current;
    const y = useRef(new Animated.Value(0)).current;

    const xSize = useRef(new Animated.Value(0)).current;
    const ySize = useRef(new Animated.Value(0)).current;

    const xLeasure = useRef(new Animated.Value(0)).current;
    const yLeasure = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if(type === "kanban") {
            addEmptyColumns(columns, true);
        } else {
            editRowsForCalendarType(columns, true);
            editRowsForCalendarTitles(titlesOfRows, true);
        }
    }, []);

    useEffect(() => {
        if(onChanged) onChanged(columns);
    }, [columns]);

    const editRowsForCalendarTitles = (_rows, withUpdate) => {
        const keys = Object.keys(_rows);
        let newP = {
        };

        keys.forEach(item => {
            newP[item] = {
                ..._rows[item],
                __key: uuid()
            };
        });

        if(withUpdate) {
            setRows(newP);
        } else {
            return newP;
        }
    };

    const editRowsForCalendarType = (_columns, withUpdate) => {
        const titles = Object.keys(titlesOfRows);
        let _newColumnsData = [];

        _columns.forEach((p_item, p_index) => {
            _newColumnsData.push({
                ...p_item,
                rows: {
                }
            });

            titles.forEach((c_item, c_index) => {
                if(!_columns[p_index].rows[c_item]) {
                    _newColumnsData[p_index].rows[c_item] = {
                        hidden: true,
                        __key: uuid()
                    };
                } else {
                    _newColumnsData[p_index].rows[c_item] = _columns[p_index].rows[c_item];
                }
            });
        });

        if(withUpdate) {
            setColumns(_newColumnsData);
        } else {
            return _newColumnsData;
        }
    };

    const addEmptyColumns = (_columns, withUpdate) => {
        let _newColumnsData = JSON.parse(JSON.stringify(_columns));
        for(let i = 0; i < kanbanEmptyRowCount; i++) {
            _newColumnsData.forEach((_, index) => {
                _newColumnsData[index].rows.push({
                    __key: uuid(),
                    hidden: true
                });
            });
        }
        if(withUpdate) {
            setColumns(_newColumnsData);
        } else {
            return _newColumnsData;
        }
    };

    const updateWhenMoving = (_columns, columnIndex, rowIndex) => {
        if(columnIndex === -1 || rowIndex === -1) {
            return;
        }

        let _newColumnsData = _columns;

        if(type === "kanban") {
            _columns.forEach((_, index) => {
                _newColumnsData[index].rows = _newColumnsData[index].rows.filter(e => e.hidden !== true);
            });

            if(rowIndex <= _newColumnsData[columnIndex].rows.length - 1) {
                _newColumnsData[columnIndex].rows.insert(rowIndex, {
                    __key: uuid(),
                    hidden: true
                });
            }
            _newColumnsData = addEmptyColumns(_newColumnsData);
        }

        setColumns(_newColumnsData);
    };

    const updateWhenRelease = (_columns, columnIndex, rowIndex, key, prevColumnIndex, prevRowObjectKey) => {
        if(columnIndex === -1 || rowIndex === -1) {
            return;
        }

        let _newColumnsData = JSON.parse(JSON.stringify(_columns));

        if(type === "kanban") {
            _columns.forEach((_, index) => {
                _newColumnsData[index].rows = _newColumnsData[index].rows.filter(e => e.hidden !== true);
            });

            const prevData = _columns[prevColumnIndex].rows.find(e => e.__key === key);
            _newColumnsData[prevColumnIndex].rows = _newColumnsData[prevColumnIndex].rows.filter(e => e.__key !== key);

            if(rowIndex <= _newColumnsData[columnIndex].rows.length - 1) {
                _newColumnsData[columnIndex].rows.insert(rowIndex, {
                    ...prevData,
                    __key: uuid()
                });
            } else {
                _newColumnsData[columnIndex].rows.push({
                    ...prevData,
                    __key: uuid()
                });
            }

            _newColumnsData = addEmptyColumns(_newColumnsData);
        } else {
            const keys = Object.keys(rows);

            const prevData = _columns[prevColumnIndex].rows[prevRowObjectKey];
            _newColumnsData[prevColumnIndex].rows[prevRowObjectKey] = {
                hidden: true,
                __key: uuid()
            };

            const targetKey = keys[rowIndex];
            if(!_columns[columnIndex].rows[targetKey].hidden) {
                const targetPrevData = _columns[columnIndex].rows[targetKey];
                _newColumnsData[prevColumnIndex].rows[prevRowObjectKey] = targetPrevData;
            }
            _newColumnsData[columnIndex].rows[targetKey] = prevData;

            _newColumnsData = editRowsForCalendarType(_newColumnsData, false);
        }

        setColumns(_newColumnsData);
    };

    const renderTitlesOfRowsColumn = () => {
        if(type === "kanban") {
            return null;
        }

        return <Column
            title="Time"
            rows={rows}
            index={-1}
            id={uuid()}
            type={type}
            titleContainerStyle={titleContainerStyle}
            customWidth={firstColumn}
            customSpacing={spaces.content * 2}
            isDraggable={false}
            renderItem={({
                item,
                index
            }) => {
                if(renderTitles) {
                    return renderTitles({
                        item,
                        index
                    });
                }

                return <View style={stylesheet.firstColumnItemContainer}>
                    <Text 
                        style={[
                            stylesheet.firstColumnItemTitle
                        ]}
                        variant={"header5"}
                    >
                        {item.title} 
                    </Text>
                    <Text
                        style={stylesheet.firstColumnItemContent}
                    >
                        {Number(item.title.split(":")[0]) > 12 ? "PM" : "AM"}
                    </Text>
                </View>;
            }}
        />;
    };

    const renderColumn = ({
        item,
        index
    }) => {
        return <Column
            lastItemIndex={columns.length - 1}
            title={item.title}
            rows={item.rows}
            index={index}
            verticalScrollRef={verticalScrollRef}
            horizontalScrollRef={horizontalScrollRef}
            customStartLocation={type === "kanban" ? 0 : firstColumn + spaces.content * 2}
            updateWhenMoving={updateWhenMoving}
            updateWhenRelease={updateWhenRelease}
            customSpacing={customSpacing}
            customWidth={customWidth}
            isDraggable={isDraggable}
            titleContainerStyle={titleContainerStyle}
            type={type}
            data={columns}
            animatedX={x}
            xSize={xSize}
            xLeasure={xLeasure}
            renderTitle={renderTitle}
            animatedY={y}
            ySize={ySize}
            yLeasure={yLeasure}
            key={(_, i) => `column-item-${i}`}
            renderItem={({
                item,
                index
            }) => {
                return renderItem({
                    item,
                    index
                });
            }} 
        />;
    };

    const renderColumns = () => {
        return <FlatList
            keyExtractor={(_, index) => `column-${index}`}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={columns}
            horizontal={true}
            renderItem={({
                item,
                index
            }) => {
                return renderColumn({
                    item,
                    index
                });
            }}
        />;
    };

    return <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={(e) => {
            verticalScrollRef.current = e;
        }}
        onContentSizeChange={(_, h) => {
            ySize.setValue(h);
        }}
        scrollEventThrottle={1}
        onLayout={({
            nativeEvent
        }) => {
            const {
                layout
            } = nativeEvent;

            yLeasure.setValue(layout.height);
        }}
        onScroll={({
            nativeEvent
        }) => {
            const {
                contentOffset,
                layoutMeasurement
            } = nativeEvent;

            yLeasure.setValue(layoutMeasurement.height);
            y.setValue(contentOffset.y);
        }}
    > 
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={stylesheet.container}
            horizontal={true}
            onContentSizeChange={(w) => {
                xSize.setValue(w);
            }}
            onLayout={({
                nativeEvent
            }) => {
                const {
                    layout
                } = nativeEvent;
    
                xLeasure.setValue(layout.width);
            }}
            onScroll={({
                nativeEvent
            }) => {
                const {
                    contentOffset,
                    layoutMeasurement
                } = nativeEvent;

                xLeasure.setValue(layoutMeasurement.width);
                x.setValue(contentOffset.x);
            }}
            ref={(e) => {
                horizontalScrollRef.current = e;
            }}
            contentOffset={{
                x: Number(JSON.stringify(x)),
                y: 0
            }}
        >
            {renderTitlesOfRowsColumn()}
            {renderColumns()}
        </ScrollView>
    </ScrollView>;
};
export default Kanban;
