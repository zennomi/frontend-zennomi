import { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// @mui
import { Card, CardContent, CardActionArea, Box, Grid, Typography, Avatar } from '@mui/material';
import Fab from '@mui/material/Fab';
// components
import Image from "../../components/Image";
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
// paths
import {
    PATH_WIBU
} from "../../routes/paths";
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
});

export default function ListDragAndDrop({ titles, handleDragEnd, handleRemoveButtonClick }) {

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {titles.map((title, index) => (
                            <Draggable key={title.id} draggableId={title.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card sx={{ p: 1, m: 1 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2}>
                                                    <Card sx={{ borderRadius: 1 }}>
                                                        <CardActionArea component={RouterLink} to={`${PATH_WIBU.title.one}/${title._id}`}>
                                                            <Image src={title.coverArt[0]} ratio='3/4' />
                                                        </CardActionArea>
                                                    </Card>
                                                    <Avatar
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            bgcolor: 'primary.main',
                                                            color: 'common.white'
                                                        }}
                                                    >{index + 1}
                                                    </Avatar>

                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant='h6'>{title.name}</Typography>
                                                    <Typography variant='body1'>{title.altTitle}</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {title?.genres.map(genre => <Label key={genre} color='primary' sx={{ m: 0.2 }}>{genre}</Label>)}
                                                        {title?.tags.map(tag => <Label key={tag} color='primary' variant='outlined' sx={{ m: 0.2 }}>{tag}</Label>)}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Fab
                                                size="small"
                                                aria-label="delete"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    bgcolor: 'error.main',
                                                    color: 'common.white'
                                                }}
                                                onClick={() => { handleRemoveButtonClick(title.id) }}
                                            >
                                                <Iconify icon='ep:delete-filled' />
                                            </Fab>
                                        </Card>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

