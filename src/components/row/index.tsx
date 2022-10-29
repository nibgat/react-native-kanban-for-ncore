// @ts-nocheck
import React from "react";
import {
    View
} from "react-native";
import stylesheet from "./stylesheet";

const Row = ({
    rowHeight,
    content
}) => {
    return <View
        style={[
            stylesheet.container,
            {
                height: rowHeight
            }
        ]}
    >
        {content}
    </View>;
};
export default Row;
