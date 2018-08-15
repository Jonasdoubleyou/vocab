import * as React from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { IVocab } from "./../vocabulary";

interface State {
    front: string;
    back: string;
}

interface Props {
    cancel: () => void;
    add: (card: IVocab) => void;
}

// Shows a form to create a new card, will cancel() or add(card) depending on the user action
export default class AddCard extends React.Component<Props, State> {
    state = { front: "", back: "" };

    update(prop: keyof State) {
        return (event: any) => {
            const { value } = event.target;
            this.setState(state => ({
                ...state,
                [prop]: value
            }));
        };
    }

    render() {
        return (
            <div>
                <Grid container direction="column">
                    <TextField
                        onChange={this.update("front")}
                        required
                        helperText="Frage"
                    />
                    <TextField
                        onChange={this.update("back")}
                        required
                        helperText="Antwort"
                    />
                    <Button onClick={() => this.submit()} variant="raised">
                        Hinzufügen
          </Button>
                    <Button onClick={() => this.props.cancel()}>Abbrechen</Button>
                </Grid>
            </div>
        );
    }

    submit() {
        const { back, front } = this.state;
        if (front && back)
            //@ts-ignore
            this.props.add({
                back,
                front,
                metadata: {
                    consecCorrectAnswers: 0,
                    easiness: 2.5,
                    nextDueDate: new Date()
                }
            });
    }
}
