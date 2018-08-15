import * as React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
//import { withStyle, WithStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import ArrowRight from "@material-ui/icons/KeyboardArrowRight";

import { IVocab } from "../vocabulary";
import { levWrapper } from "../algorithm/levenshtein/lev";

interface IReviewPageProps {
    vocab: IVocab;
    nextCard: () => void;
}

interface IReviewPageState {
    inputValue: string;
    showPopover: boolean;
    popoverText: string;
    popoverColor: string;
    answerCorrect: boolean;
}

export default class ReviewPage extends React.Component<
    IReviewPageProps,
    IReviewPageState
    > {
    popoverTimer: any;
    buttonRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            popoverText: "",
            inputValue: "",
            showPopover: false,
            answerCorrect: false,
            popoverColor: "red",
        };
    }

    checkAnswer() {
        // Levenstein Distance
        const { back } = this.props.vocab;
        const distance = levWrapper(
            this.state.inputValue.toLowerCase(),
            this.props.vocab.back.toLowerCase()
        );

        // If the Levenstein Distance if below a certain threshhold, then
        // we will consider the answer as partially correct.
        // If the distance is 0, then the answer is correct. Otherwise it's wrong.
        if (distance === 0) {
            this.showPopover("Correct");
            this.props.nextCard();
        } else if (distance < back.length / 4 && distance !== 0) {
            // Nearly
            this.showPopover("Nearly");
        } else {
            // Wrong
            this.showPopover("Wrong");
        }
    }

    // Show the Popover, which tells the user that the last
    // answer was wrong
    showPopover(popoverText) {
        const color = {
            "Correct": "green",
            "Nearly": "orange",
            "Wrong": "red",
        }[popoverText];
        this.setState(
            {
                showPopover: true,
                popoverText,
                popoverColor: color,
            },
            () => {
                this.popoverTimer = setTimeout(() => {
                    this.closePopover();
                }, 1200);
            }
        );
    }

    // Close the Popover, which tells the user that the last
    // answer was wrong
    closePopover() {
        if (this.popoverTimer) {
            clearTimeout(this.popoverTimer);
            this.popoverTimer = null;

            this.setState({
                showPopover: false
            });
        }
    }

    render() {
        return (
            <div>
                <Grid container justify="center" item>
                    <Grid item xs={12} lg={8}>
                        <Card>
                            <CardContent>
                                <Grid container justify="center" direction="column">
                                    <Typography variant="display1">
                                        {this.props.vocab.front}
                                    </Typography>
                                    <TextField
                                        value={this.state.inputValue}
                                        onChange={event =>
                                            this.setState({ inputValue: event.target.value })
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    onClick={() => this.checkAnswer()}
                                                    buttonRef={node => (this.buttonRef = node)}
                                                >
                                                    <ArrowRight />
                                                </IconButton>
                                            )
                                        }}
                                    />
                                    <Popover
                                        open={this.state.showPopover}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "left"
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "right"
                                        }}
                                        anchorEl={this.buttonRef}
                                        onClose={() => this.closePopover()}
                                        PaperProps={{
                                            style: {
                                                backgroundColor: this.state.popoverColor,
                                                padding: 10,
                                                color: "white"
                                            }
                                        }}
                                    >
                                        <Typography variant="button" color="inherit">
                                            {this.state.popoverText}
                                        </Typography>
                                    </Popover>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
