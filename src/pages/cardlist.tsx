import * as React from "react";

import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import CardView from "./review";
import { IVocabList, IVocab } from "../vocabulary";
import AddCard from "./addCard";

interface State {
    // The currently displayed card
    current: number;
    addCard: boolean;
}

interface Props {
    list: IVocabList;
    updateList: (list: IVocabList) => void;
}

export default class CardList extends React.Component<Props, State> {
    state = { current: 0, addCard: false };
    render() {
        const { current } = this.state;
        const { list } = this.props;
        const { entries, from, to, name } = list;

        let content = (
            <CardView vocab={entries[current]} nextCard={() => this.nextCard()} />
        );

        if (!entries.length || this.state.addCard) {
            content = (
                <AddCard
                    add={card => {
                        this.addCard(card);
                        this.setState({ addCard: false });
                    }}
                    cancel={() => this.setState({ addCard: false })}
                />
            );
        }

        return (
            <Grid container>
                <Grid item xs={12} md={2}>
                    <Typography variant="display1" align={"center"}>
                        {name}
                    </Typography>
                    <Typography variant="caption" align={"center"}>
                        {from} nach {to}
                    </Typography>
                    <Typography align={"center"}>
                        <Button
                            onClick={() => this.setState({ addCard: true })}
                        >
                            Karte hinzufügen
            </Button>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    {content}
                </Grid>
            </Grid>
        );
    }

    addCard(card: IVocab) {
        const { entries, from, name, to, id } = this.props.list;
        this.props.updateList({
            id,
            from,
            to,
            name,
            entries: entries.concat(card)
        });
    }

    nextCard() {
        this.setState(({ current }) => ({
            current: (current + 1) % this.props.list.entries.length
        }));
    }
}
