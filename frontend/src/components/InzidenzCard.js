import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Card, CardActions, CardMedia, Fab, IconButton, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
      margin: theme.spacing(2),
      padding: theme.spacing(1),
    },
  }));
  

export default function InzidenzCard({county, inzidenzToday}) {
    const classes = useStyles();
    return (
      <Card className={classes.card}>
        <Typography variant="caption">{county}</Typography>
        <Typography variant="h1">{inzidenzToday}</Typography>
      </Card>
    )
  }
  