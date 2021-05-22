import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import {Clear, Search} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    counties: {
        minWidth: '25em',
    }
}));

function Counties({className, counties, selectedCounties, onToggle}) {
    return useMemo(() =>
        <List dense className={className}>
            {counties.map(name =>
                <ListItem button onClick={() => onToggle(name)} key={name}>
                    <ListItemIcon>
                        <Checkbox edge="start" disableRipple checked={selectedCounties.has(name)} />
                    </ListItemIcon>
                    <ListItemText>{name}</ListItemText>
                </ListItem>)
            }
        </List>, [counties, selectedCounties, onToggle]);
}

const initialState = {
    initialized: false,
    searchText: '',
    selectedCounties: new Set(),
    allCounties: [],
    filteredCounties: [],
}

const MIN_FILTER_LENGTH = 3;

function reducer(state, action) {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                initialized: true,
                allCounties: action.counties,
                filteredCounties: action.counties,
                selectedCounties: action.selectedCounties,
            }
        case 'change_search': {
            let newFilteredCounties;
            if (!action.value || (action.value.length < MIN_FILTER_LENGTH && state.searchText.length >= MIN_FILTER_LENGTH)) {
                newFilteredCounties = state.allCounties;
            }
            else if (action.value.length >= MIN_FILTER_LENGTH) {
                const term = action.value.toLowerCase();
                newFilteredCounties = state.allCounties.filter(county => county.toLowerCase().indexOf(term) !== -1);
            }
            else {
                newFilteredCounties = state.filteredCounties;
            }
            return {
                ...state,
                searchText: action.value,
                filteredCounties: newFilteredCounties,
            }
        }
        case 'toggle_county': {
            const selectedCounties = new Set(state.selectedCounties);
            if (selectedCounties.has(action.county)) {
                selectedCounties.delete(action.county);
            }
            else {
                selectedCounties.add(action.county);
            }
            return {
                ...state,
                selectedCounties,
            }
        }
        default:
            return state;
    }
}

export default function SelectCountyDialog({ allCounties, activeCounties, onApply, onCancel }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {initialized, filteredCounties, searchText, selectedCounties} = state;
    const classes = useStyles();

    useEffect(() => setTimeout(() => 
        dispatch({type: 'init', counties: allCounties, selectedCounties: new Set(activeCounties)})
        , 1), [allCounties, activeCounties]);

    const updateSearch = useCallback(function (event) {
        dispatch({type: 'change_search', value: event.target.value});
    }, []);

    const clearSearch = useCallback(function () {
        dispatch({type: 'change_search', value: ''});
    }, []);

    const toggle = useCallback(function (name) {
        dispatch({type: 'toggle_county', county: name})
    }, []);

    return (
        <Dialog open={true} scroll="paper" className="county-dialog">
            <DialogTitle>
                <div>Angezeigte Kreise auswählen</div>
                <Input 
                    value={searchText} 
                    onChange={updateSearch} 
                    endAdornment={
                        <InputAdornment position="end">
                            {searchText ? <IconButton onClick={clearSearch}><Clear /></IconButton> : <Search />}
                        </InputAdornment>
                    }
                />
            </DialogTitle>
            <DialogContent className={classes.counties}>
                {initialized 
                    ? <Counties counties={filteredCounties} selectedCounties={selectedCounties} onToggle={toggle} />
                    : <Typography variant="body1">Lade...</Typography>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Abbrechen</Button>
                <Button color="primary" variant="contained" onClick={() => onApply(Array.from(selectedCounties))}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
