// @ts-nocheck
import React, {
    useEffect,
    useState,
    useMemo,
    useRef
} from "react";
import {
    PanResponder,
    Animated
} from "react-native";
import {
} from "ncore-mobile";
import {
    windowHeight,
    windowWidth
} from "../../constants";
import {
    Portal 
} from "react-native-portalize";
import {
    columnHeaderHeight,
    columnWidth,
    rowHeight
} from "../column";
import {
    detectColumnTheCursorIsOn,
    createColumnCollisions,
    horizontalScrolling,
    createRowCollisions,
    verticalScrolling
} from "../../utils";

const HORIZONTAL_SCROLL_TRESHOLD = (windowWidth * 5) / 100;
const VERTICAL_SCROLL_TRESHOLD = (windowHeight * 10) / 100;

const DragableObject = ({
    horizontalScrollTreshold = HORIZONTAL_SCROLL_TRESHOLD,
    verticalScrollTreshold = VERTICAL_SCROLL_TRESHOLD,
    customStartLocation,
    horizontalScrollRef,
    lastColumnItemIndex,
    verticalScrollRef,
    updateWhenRelease,
    updateWhenMoving,
    keyForCalendar,
    columnSpacing,
    columnIndex,
    animatedX,
    animatedY,
    children,
    xLeasure,
    yLeasure,
    __key,
    ySize,
    xSize,
    type,
    data
}) => {
    const [tempData, setTempData] = useState(data);

    const [isMoving, setIsMoving] = useState(false);

    const x = useRef(new Animated.Value(0)).current;
    const y = useRef(new Animated.Value(0)).current;

    const height = useRef(new Animated.Value(0)).current;
    const width = useRef(new Animated.Value(0)).current;

    const moveX = useRef(new Animated.Value(0)).current;
    const moveY = useRef(new Animated.Value(0)).current;

    const isScrollingX = useRef();
    const isScrollingY = useRef();

    const panResponder = useMemo(
        () => PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                const {
                    pageX,
                    pageY
                } = evt.nativeEvent;
                const {
                    dx,
                    dy
                } = gestureState;

                horizontalScrollRef.current.scrollEnabled = false;
                verticalScrollRef.current.scrollEnabled = false;
                setIsMoving(true);

                x.setValue(pageX - (Number(JSON.stringify(width)) / 2));
                y.setValue(pageY - (Number(JSON.stringify(height)) / 2));

                moveX.setValue(dx);
                moveY.setValue(dy);
            },

            onPanResponderMove: (evt, gestureState) => {
                const {
                    pageX,
                    pageY
                } = evt.nativeEvent;
                const {
                    dx,
                    dy
                } = gestureState;

                horizontalScrolling({
                    horizontalScrollTreshold,
                    horizontalScrollRef,
                    isScrollingX,
                    animatedX,
                    xLeasure,
                    pageX,
                    xSize
                });

                verticalScrolling({
                    verticalScrollTreshold,
                    verticalScrollRef,
                    isScrollingY,
                    animatedY,
                    yLeasure,
                    pageY,
                    ySize
                });
 
                moveX.setValue(dx);
                moveY.setValue(dy);

                const startLocation = customStartLocation ? customStartLocation : 0;
                const currentScrollEnd = Number(JSON.stringify(animatedX)) + Number(JSON.stringify(xLeasure));
                const currentScrollStart = Number(JSON.stringify(animatedX));

                let allColumunsLocations = [];

                createColumnCollisions({
                    allColumunsLocations,
                    lastColumnItemIndex,
                    currentScrollStart,
                    currentScrollEnd,
                    startLocation,
                    columnSpacing,
                    columnWidth
                });

                const currentColumnIndex = detectColumnTheCursorIsOn({
                    allColumunsLocations,
                    pageX
                });
                gestureState.currentColumnIndex = currentColumnIndex;

                const currentScrollYStart = Number(JSON.stringify(animatedY));
                const currentScrollYEnd = Number(JSON.stringify(animatedY)) + Number(JSON.stringify(yLeasure));

                const rowArea = Number(JSON.stringify(ySize)) - columnHeaderHeight;
                const totalRowCount = Math.ceil(rowArea / rowHeight);

                let allRowsLocations = [];

                createRowCollisions({
                    currentScrollYStart,
                    columnHeaderHeight,
                    currentScrollYEnd,
                    allRowsLocations,
                    totalRowCount,
                    rowHeight
                });

                let currentRowIndex = -1;
                for(let i = 0; i < allRowsLocations.length; i++) {
                    if(allRowsLocations[i].isVisible) {
                        if(pageY > allRowsLocations[i].visibilityTreshold.startY && pageY < allRowsLocations[i].visibilityTreshold.endY) {
                            currentRowIndex = i;
                        }
                    }
                }
                gestureState.currentRowIndex = currentRowIndex;

                if(type === "kanban") updateWhenMoving(tempData, currentColumnIndex, currentRowIndex);
                gestureState.ldata = tempData;
            },

            onPanResponderRelease: (evt, gestureState) => {
                gestureState.animatedX = animatedX;
                gestureState.animatedY = animatedY;

                gestureState.xLeasure = xLeasure;
                gestureState.yLeasure = yLeasure;

                drop(evt, gestureState);
            },

            onPanResponderEnd: (evt, gestureState) => {
                gestureState.animatedX = animatedX;
                gestureState.animatedY = animatedY;

                gestureState.xLeasure = xLeasure;
                gestureState.yLeasure = yLeasure;

                drop(evt, gestureState);
            },

            onPanResponderReject: (evt, gestureState) => {
                gestureState.animatedX = animatedX;
                gestureState.animatedY = animatedY;

                gestureState.xLeasure = xLeasure;
                gestureState.yLeasure = yLeasure;

                drop(evt, gestureState);
            },

            onPanResponderTerminate: (evt, gestureState) => {
                gestureState.animatedX = animatedX;
                gestureState.animatedY = animatedY;

                gestureState.xLeasure = xLeasure;
                gestureState.yLeasure = yLeasure;

                drop(evt, gestureState);
            }
        }),
        [
            isScrollingX,
            isScrollingY,
            animatedX,
            animatedY,
            xLeasure,
            yLeasure,
            tempData,
            xSize,
            ySize
        ]
    );

    const drop = (event, gestureState) => {
        if(!horizontalScrollRef.current) {
            return;
        }

        if(!verticalScrollRef.current) {
            return;
        }

        if(isScrollingX.current) {
            clearInterval(isScrollingX.current);
            isScrollingX.current = null;
        }

        if(isScrollingY.current) {
            clearInterval(isScrollingY.current);
            isScrollingY.current = null;
        }

        horizontalScrollRef.current.scrollEnabled = true;
        verticalScrollRef.current.scrollEnabled = true;

        updateWhenRelease(
            gestureState.ldata,
            gestureState.currentColumnIndex,
            gestureState.currentRowIndex,
            __key,
            columnIndex,
            keyForCalendar
        );

        setIsMoving(false);
    };

    useEffect(() => {
        if(!isMoving) {
            setTempData(data);
        }
    }, [isMoving, data]);

    return <Animated.View
        {...panResponder.panHandlers}
        onLayout={({
            nativeEvent
        }) => {
            const {
                height: initialHeight,
                width: initialWidth
            } = nativeEvent.layout;

            height.setValue(initialHeight);
            width.setValue(initialWidth);
        }}
        style={{
            opacity: isMoving ? 0 : 1
        }}
    >
        {children}
        <Portal>
            {
                isMoving ?
                    <Animated.View
                        style={{
                            position: "absolute",
                            height: height,
                            width: width,
                            zIndex: 9999,
                            left: Number(JSON.stringify(x)),
                            top: Number(JSON.stringify(y)),
                            transform: [
                                {
                                    translateX: moveX
                                },
                                {
                                    translateY: moveY
                                }
                            ]
                        }}
                    >
                        {children}
                    </Animated.View>
                    :
                    null
            }
        </Portal>
    </Animated.View>;
};
export default DragableObject;
