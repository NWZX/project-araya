import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Grid,
    List,
    ListSubheader,
    ListItem,
    Slider,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { ITag } from 'interfaces';
import TagFilters from './TagFilters';

const marks = [
    {
        value: 0,
        distance: 100,
        label: '100m',
    },
    {
        value: 1,
        distance: 500,
        label: '500',
    },
    {
        value: 2,
        distance: 1000,
        label: '1',
    },
    {
        value: 3,
        distance: 5000,
        label: '5',
    },
    {
        value: 4,
        distance: 10000,
        label: '10Km',
    },
];
function valuetext(value: number): string {
    return marks.find((v) => v.value == value)?.label || '';
}

interface Props {
    tags?: ITag[];
    onTagsChange: (selected: string[]) => void;
    onOptionChange: (delivery?: boolean, takeAway?: boolean) => void;
}

const Filters = ({ tags, onOptionChange, onTagsChange }: Props): JSX.Element => {
    return (
        <Accordion variant="outlined" TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1a-header">
                <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid item xs={12}>
                        <List subheader={<ListSubheader>Distance</ListSubheader>}>
                            <ListItem>
                                <Slider
                                    max={4}
                                    defaultValue={0}
                                    getAriaValueText={valuetext}
                                    step={null}
                                    valueLabelDisplay="off"
                                    marks={marks}
                                    disabled={true}
                                />
                            </ListItem>
                        </List>
                        <List subheader={<ListSubheader>Tags</ListSubheader>}>
                            <ListItem>
                                <TagFilters tags={tags} onTagsChange={onTagsChange} />
                            </ListItem>
                        </List>
                        <List subheader={<ListSubheader>Option</ListSubheader>}>
                            <ListItem>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={false}
                                                    onChange={(e) => {
                                                        onOptionChange(e.target.checked);
                                                    }}
                                                    name="serviceType.delivery"
                                                />
                                            }
                                            label="Livraison"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={false}
                                                    onChange={(e) => {
                                                        onOptionChange(undefined, e.target.checked);
                                                    }}
                                                    name="serviceType.takeAway"
                                                />
                                            }
                                            label="Take Away"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default Filters;
