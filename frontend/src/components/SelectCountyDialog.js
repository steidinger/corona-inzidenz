import { useState } from 'react';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, DialogActions, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export default function SelectCountyDialog({ allCounties, activeCounties, onApply, onCancel }) {
    const [selectedCounties, setSelectedCounties] = useState(new Set(activeCounties));

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
        <Dialog open={true} scroll="paper">
            <DialogTitle>Angezeigte Kreise auswählen</DialogTitle>
            <DialogContent>
                <List dense button>
                    {allCounties.map(name =>
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
