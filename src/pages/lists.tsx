import * as React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import ListView from "./cardlist";
import { IVocab, IVocabList } from "../vocabulary";
import { getSortedReadyCards } from "../algorithm/sm2/algorithm";

interface State {
    // The currently displayed list
    current?: IVocabList;
}

interface Props {
    lists: IVocabList[];
    updateList: (list: IVocabList) => void;
    currentList?: IVocabList;
}

const style = {
    listCard: {
        marginTop: 10
    }
};

const component = withStyles(style)(
    class Lists extends React.Component<Props & WithStyles<"listCard">, State> {
        state = { current: this.props.currentList /*|| this.getList()*/ };

        listToCardFactory() {
            let key = 0;
            const { listCard } = this.props.classes;
            return (list: IVocabList) => (
                <Card
                    className={listCard}
                    key={key++}
                    onClick={() => this.setState({ current: list })}
                >
                    <CardHeader title={list.name} />
                    <CardContent>
                        <Typography variant="subheading">
                            {list.from} -> {list.to}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        render() {
            const { current } = this.state;
            const { lists, updateList } = this.props;
            if (!lists.length) {
                return (
                    <Typography variant="title"> Keine Liste vorhanden! </Typography>
                );
            }

            if (!current) {
                const listToCard = this.listToCardFactory();
                return lists.map(listToCard);
            }

            return (
                <ListView list={current} key={current.id} updateList={updateList} />
            );
        }

        componentWillReceiveProps(props: Props) {
            this.setState({
                current: props.currentList // || this.getList()
            });
        }

        getList() {
            return this.props.lists[
                Math.floor(this.props.lists.length * Math.random())
            ];
        }
    }
);

export default component;
