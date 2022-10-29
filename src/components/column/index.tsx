// @ts-nocheck
import React from "react";
import {
    View
} from "react-native";
import stylesheet from "./stylesheet";
import {
    Text,
    useNCoreTheme
} from "ncore-mobile";
import {
    windowWidth,
    windowHeight
} from "../../constants";
import Row from "../row/index";
import DragableObject from "../dragableObject";

export const columnWidth = (windowWidth * 75) / 100;
export const rowHeight = (windowHeight * 20) / 100;
export const columnHeaderHeight = 55;

const Column = ({
    horizontalScrollRef,
    titleContainerStyle,
    customStartLocation,
    updateWhenRelease,
    verticalScrollRef,
    updateWhenMoving,
    lastItemIndex,
    customSpacing,
    renderTitle,
    customWidth,
    isDraggable,
    titleStyle,
    renderItem,
    animatedX,
    animatedY,
    xLeasure,
    yLeasure,
    ySize,
    index,
    title,
    xSize,
    data,
    rows,
    type
}) => {
    const {
        radiuses,
        spaces,
        colors
    } = useNCoreTheme();

    const renderRowsData = type === "kanban" ? rows : Object.keys(rows);

    const renderHidden = () => {
        return <Row
            rowHeight={rowHeight}
        />;
    };

    const renderRow = (c_item, c_index) => {
        if(type !== "kanban" && rows[c_item].hidden) {
            return renderHidden();
        } else if(type === "kanban" && c_item.hidden) {
            return renderHidden();
        }
        
        if(isDraggable) {
            return <DragableObject
                columnSpacing={customSpacing ? customSpacing : spaces.content * 4}
                __key={type === "kanban" ? c_item.__key : rows[c_item].__key}
                keyForCalendar={type === "kanban" ? undefined : c_item}
                horizontalScrollRef={horizontalScrollRef}
                customStartLocation={customStartLocation}
                verticalScrollRef={verticalScrollRef}
                updateWhenRelease={updateWhenRelease}
                lastColumnItemIndex={lastItemIndex}
                updateWhenMoving={updateWhenMoving}
                animatedX={animatedX}
                animatedY={animatedY}
                xLeasure={xLeasure}
                yLeasure={yLeasure}
                columnIndex={index}
                xSize={xSize}
                ySize={ySize}
                type={type}
                data={data}
            >
                {
                    renderItem({
                        item: type === "kanban" ? c_item : rows[c_item],
                        index: c_index
                    })
                }
            </DragableObject>;
        }

        return renderItem({
            item: type === "kanban" ? c_item : rows[c_item],
            index: c_index
        });
    };

    return <View
        style={[
            stylesheet.container,
            {
                marginRight: index === lastItemIndex ? 0 : customSpacing ? customSpacing : spaces.content * 4,
                backgroundColor: colors.layer2,
                width: customWidth ? customWidth : columnWidth,
                borderRadius: radiuses.hard
            }
        ]}
    >
        <View 
            style={[
                stylesheet.titleContainer,
                {
                    backgroundColor: colors.layer3,
                    borderTopLeftRadius: radiuses.hard,
                    borderTopRightRadius: radiuses.hard,
                    height: columnHeaderHeight
                },
                titleContainerStyle
            ]}
        >
            {
                renderTitle ?
                    renderTitle({
                        item: data[index],
                        index: index
                    })
                    :
                    <Text
                        style={[
                            stylesheet.title,
                            titleStyle
                        ]}
                        variant="body"
                    >
                        {title}
                    </Text>
            }
        </View>
        <View style={stylesheet.contentContainer}>
            {
                renderRowsData.map((c_item, c_index) => {
                    return <Row
                        key={type === "kanban" ? c_item.__key : rows[c_item].__key}
                        rowHeight={rowHeight}
                        index={c_index}
                        content={renderRow(c_item, c_index)}
                        lastItemIndex={renderRowsData.length - 1}
                    />;
                })
            }
        </View>
    </View>;
};
export default Column;
