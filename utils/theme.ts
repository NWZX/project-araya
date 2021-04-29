import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import { colors } from '@material-ui/core';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.lightGreen[300],
        },
        secondary: {
            main: colors.deepOrange[300],
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#f4f6f8', //'#f4f6f8 | #121212',
        },
        type: 'light',
    },
});

export default theme;
