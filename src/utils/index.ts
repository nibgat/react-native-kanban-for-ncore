// @ts-nocheck
import {
    windowHeight,
    windowWidth
} from "../constants";

Array.prototype.insert = function (
    index,
    ...items
) {
    this.splice(
        index,
        0,
        ...items
    );
};

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const horizontalScrolling = ({
    horizontalScrollTreshold,
    horizontalScrollRef,
    isScrollingX,
    animatedX,
    xLeasure,
    pageX,
    xSize
}) => {
    let anyScrollX = null;

    if(pageX < horizontalScrollTreshold && Number(JSON.stringify(animatedX)) > 0) {
        if(!isScrollingX.current) {
            isScrollingX.current = setInterval(() => {
                if(horizontalScrollRef.current) horizontalScrollRef.current.scrollTo({
                    x: Number(JSON.stringify(animatedX)) - 50,
                    animated: false
                });
            }, 50);
        }
        anyScrollX = "top";
    }

    if(pageX > (windowWidth - horizontalScrollTreshold) && (Number(JSON.stringify(animatedX)) + Number(JSON.stringify(xLeasure))) < Number(JSON.stringify(xSize))) {
        if(!isScrollingX.current) {
            isScrollingX.current = setInterval(() => {
                if(horizontalScrollRef.current) horizontalScrollRef.current.scrollTo({
                    x: Number(JSON.stringify(animatedX)) + 50,
                    animated: false
                });
            }, 50);
        }
        anyScrollX = "bottom";
    }

    if(!anyScrollX && isScrollingX.current) {
        clearInterval(isScrollingX.current);
        isScrollingX.current = null;
    }
};

export const verticalScrolling = ({
    verticalScrollTreshold,
    verticalScrollRef,
    isScrollingY,
    animatedY,
    yLeasure,
    pageY,
    ySize
}) => {
    let anyScrollY = null;

    if(pageY < verticalScrollTreshold && Number(JSON.stringify(animatedY)) > 0) {
        if(!isScrollingY.current) {
            isScrollingY.current = setInterval(() => {
                verticalScrollRef.current.scrollTo({
                    y: Number(JSON.stringify(animatedY)) - 50,
                    animated: false
                });
            }, 50);
        }
        anyScrollY = "top";
    }
    
    if(pageY > (windowHeight - verticalScrollTreshold) && (Number(JSON.stringify(animatedY)) + Number(JSON.stringify(yLeasure))) < Number(JSON.stringify(ySize))) {
        if(!isScrollingY.current) {
            isScrollingY.current = setInterval(() => {
                verticalScrollRef.current.scrollTo({
                    y: Number(JSON.stringify(animatedY)) + 50,
                    animated: false
                });
            }, 50);
        }
        anyScrollY = "bottom";
    }

    if(!anyScrollY && isScrollingY.current) {
        clearInterval(isScrollingY.current);
        isScrollingY.current = null;
    }
};

export const createColumnCollisions = ({
    allColumunsLocations,
    lastColumnItemIndex,
    currentScrollStart,
    currentScrollEnd,
    startLocation,
    columnSpacing,
    columnWidth
}) => {
    let beforeEndLocation = startLocation;

    for(let i = 0; i < lastColumnItemIndex + 1; i++) {
        const currentEndLocation = i === 0 ?
            beforeEndLocation + columnWidth + (columnSpacing / 2)
            :
            beforeEndLocation + columnSpacing + columnWidth;

        allColumunsLocations.push({
            index: i,
            startLocation: beforeEndLocation,
            endLocation: currentEndLocation,
            isVisible: false
        });

        const innerTresholdDetect = beforeEndLocation >= currentScrollStart && currentEndLocation >= currentScrollStart && beforeEndLocation <= currentScrollEnd && currentEndLocation <= currentScrollEnd;
        const leftIntersectionDetect = beforeEndLocation < currentScrollStart && currentEndLocation > currentScrollStart;
        const rightIntersectionDetect = beforeEndLocation < currentScrollEnd && currentEndLocation > currentScrollEnd;

        if(innerTresholdDetect) {
            allColumunsLocations[i].visibleType = "all";
            allColumunsLocations[i].isVisible = true;
        } else if(leftIntersectionDetect) {
            allColumunsLocations[i].visibleType = "left";
            allColumunsLocations[i].isVisible = true;
            allColumunsLocations[i].visibilityTreshold = {
                startX: 0,
                endX: currentEndLocation - currentScrollStart
            };
        } else if(rightIntersectionDetect) {
            allColumunsLocations[i].visibleType = "right";
            allColumunsLocations[i].isVisible = true;
            allColumunsLocations[i].visibilityTreshold = {
                startX: (currentScrollEnd - currentScrollStart) - (currentScrollEnd - beforeEndLocation),
                endX: currentScrollEnd - currentScrollStart
            };
        }

        beforeEndLocation = currentEndLocation;
    }
};

export const detectColumnTheCursorIsOn = ({
    allColumunsLocations,
    pageX
}) => {
    let currentColumnIndex = -1;
    for(let i = 0; i < allColumunsLocations.length; i++) {
        if(allColumunsLocations[i].isVisible) {
            if(allColumunsLocations[i].visibleType !== "all") {
                if(pageX > allColumunsLocations[i].visibilityTreshold.startX && pageX < allColumunsLocations[i].visibilityTreshold.endX) {
                    currentColumnIndex = i;
                }
            } else {
                currentColumnIndex = i;
            }
        }
    }
    return currentColumnIndex;
};

export const createRowCollisions = ({
    currentScrollYStart,
    columnHeaderHeight,
    currentScrollYEnd,
    allRowsLocations,
    totalRowCount,
    rowHeight
}) => {
    let beforeEndYLocation = columnHeaderHeight;

    for(let i = 0; i < totalRowCount; i++) {
        const currentEndLocation = beforeEndYLocation + rowHeight;

        allRowsLocations.push({
            index: i,
            startLocation: beforeEndYLocation,
            endLocation: currentEndLocation,
            isVisible: false
        });

        const innerTresholdDetect = beforeEndYLocation > currentScrollYStart && currentEndLocation > currentScrollYStart && beforeEndYLocation < currentScrollYEnd && currentEndLocation < currentScrollYEnd;
        const topIntersectionDetect = beforeEndYLocation < currentScrollYStart && currentEndLocation > currentScrollYStart;
        const bottomIntersectionDetect = beforeEndYLocation < currentScrollYEnd && currentEndLocation > currentScrollYEnd;

        if(innerTresholdDetect) {
            allRowsLocations[i].visibleType = "all";
            allRowsLocations[i].isVisible = true;
            allRowsLocations[i].visibilityTreshold = {
                startY: beforeEndYLocation - currentScrollYStart,
                endY: currentEndLocation - currentScrollYStart
            };
        } else if(topIntersectionDetect) {
            allRowsLocations[i].visibleType = "top";
            allRowsLocations[i].isVisible = true;
            allRowsLocations[i].visibilityTreshold = {
                startY: 0,
                endY: currentEndLocation - currentScrollYStart
            };
        } else if(bottomIntersectionDetect) {
            allRowsLocations[i].visibleType = "bottom";
            allRowsLocations[i].isVisible = true;
            allRowsLocations[i].visibilityTreshold = {
                startY: (currentScrollYEnd - currentScrollYStart) - (currentScrollYEnd - beforeEndYLocation),
                endY: currentScrollYEnd - currentScrollYStart
            };
        }

        beforeEndYLocation = currentEndLocation;
    }
};
