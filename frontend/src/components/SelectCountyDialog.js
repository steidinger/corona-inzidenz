import { useCallback, useState } from 'react';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {Clear, Search} from '@material-ui/icons';

export default function SelectCountyDialog({ allCounties, activeCounties, onApply, onCancel }) {
    const [selectedCounties, setSelectedCounties] = useState(new Set(activeCounties));
    const [searchTerm, setSearchTerm] = useState('');
    const [counties, setCounties] = useState(allCounties);
    
    const updateSearch = useCallback(function (event) {
        let term = event.target.value;
        setSearchTerm(event.target.value);
        if (term) {
            term = term.toLowerCase();
            setCounties(allCounties.filter(county => county.toLowerCase().indexOf(term) !== -1));
        }
        else {
            setCounties(allCounties);
        }
    }, [allCounties]);

    const clearSearch = useCallback(function () {
        setSearchTerm('');
        setCounties(allCounties);
    });

    function toggle(name) {
        const newState = new Set(selectedCounties);
        if (selectedCounties.has(name)) {
            newState.delete(name);
        }
        else {
            newState.add(name);
        }
        setSelectedCounties(newState);
    }

    return (
        <Dialog open={true} scroll="paper" className="county-dialog">
            <DialogTitle>
                <div>Angezeigte Kreise auswählen</div>
                <Input 
                    type="search" 
                    value={searchTerm} 
                    onChange={updateSearch} 
                    endAdornment={
                        <InputAdornment position="end">
                            {searchTerm ? <IconButton onClick={clearSearch}><Clear /></IconButton> : <Search />}
                        </InputAdornment>
                    }
                />
            </DialogTitle>
            <DialogContent>
                <List dense button>
                    {counties.map(name =>
                        <ListItem button onClick={() => toggle(name)} key={name}>
                            <ListItemIcon>
                                <Checkbox edge="start" disableRipple checked={selectedCounties.has(name)} />
                            </ListItemIcon>
                            <ListItemText>{name}</ListItemText>
                        </ListItem>)
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Abbrechen</Button>
                <Button color="primary" variant="contained" onClick={() => onApply(Array.from(selectedCounties))}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
