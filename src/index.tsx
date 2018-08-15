import * as React from "react";
import { render } from "react-dom";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import TextField from "@material-ui/core/TextField";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import { IVocabList } from "./vocabulary";
import ListView from "./pages/lists";

const STORE = "Vocab";

enum Page {
    START = 0,
    ADDLIST = 3
}

interface State {
    page: Page;
    lists: IVocabList[];
    currentList?: IVocabList | null;
    newList: {
        name: string;
        from: string;
        to: string;
    };
    showDrawer: boolean;
}

const componentStyle = {
    content: {
        padding: 10
    },
    drawer: {
        width: 250
    }
};

const defaultState: State = {
    page: Page.START,
    lists: [],
    newList: {
        name: "",
        from: "",
        to: ""
    },
    showDrawer: false
};

let componentKey = 0;

const StyledApp = withStyles(componentStyle)(
    class App extends React.Component<
        WithStyles<"content"> & WithStyles<"drawer">,
        State
        > {
        // TODO: Einige States sollten nicht gespeichert werden
        state = JSON.parse(
            localStorage.getItem(STORE) || JSON.stringify(defaultState)
        );

        render() {
            const { content, drawer } = this.props.classes;
            return (
                <div id="root">
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <IconButton
                                onClick={() => this.setState({ showDrawer: true })}
                                className=""
                                color="inherit"
                                aria-label="Menu"
                            >
                                <MenuIcon color="inherit" />
                            </IconButton>
                            <Typography variant="title" color="inherit" className="">
                                Vocab
              </Typography>
                        </Toolbar>
                        <Drawer
                            open={this.state.showDrawer}
                            onClose={() => this.setState({ showDrawer: false })}
                        >
                            <div className={drawer}>
                                <List component="nav">
                                    <ListItem
                                        button
                                        onClick={() =>
                                            this.setState({
                                                page: Page.START,
                                                showDrawer: false,
                                                currentList: null
                                            })
                                        }
                                    >
                                        <ListItemText>Home</ListItemText>
                                    </ListItem>
                                    <ListItem
                                        button
                                        onClick={() =>
                                            this.setState({ page: Page.ADDLIST, showDrawer: false })
                                        }
                                    >
                                        <ListItemText>Add List</ListItemText>
                                    </ListItem>
                                    <Divider />
                                    {this.state.lists.map(list => {
                                        return (
                                            <ListItem
                                                onClick={() =>
                                                    this.setState({
                                                        page: Page.START,
                                                        currentList: list,
                                                        showDrawer: false
                                                    })
                                                }
                                                button
                                                key={componentKey++}
                                            >
                                                <ListItemText>{list.name}</ListItemText>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </div>
                        </Drawer>
                    </AppBar>
                    <div className={content}>{this.getContent()}</div>
                </div>
            );
        }

        componentDidUpdate() {
            localStorage.setItem(STORE, JSON.stringify(this.state));
        }

        getContent() {
            switch (this.state.page) {
                case Page.START:
                    return this.getStart();
                case Page.ADDLIST:
                    return this.getAddListPage();
                default:
                    return <div>404: Page not found!</div>;
            }
        }

        getStart() {
            if (!this.state.lists.length) {
                return this.getAddListPage();
            }
            return (
                <ListView
                    currentList={this.state.currentList}
                    updateList={list => this.updateList(list)}
                    lists={this.state.lists}
                />
            );
        }

        updateList(list: IVocabList) {
            this.setState(({ lists, currentList }) => ({
                lists: lists.map(l => (l.id === list.id ? list : l)),
                //@ts-ignore
                currentList: list.id === (currentList || {}).id ? list : currentList
            }));
        }

        update(name: keyof State["newList"]) {
            return (event: any) => {
                const { value } = event.target;
                this.setState(({ newList }) => ({
                    newList: {
                        ...newList,
                        [name]: value
                    }
                }));
            };
        }

        getAddListPage() {
            const createList = () => {
                const list: IVocabList = {
                    id: Date.now(),
                    name: this.state.newList.name,
                    from: this.state.newList.from,
                    to: this.state.newList.to,
                    entries: []
                };
                this.setState(({ lists }) => ({
                    lists: lists.concat(list),
                    currentList: list,
                    page: Page.START,
                    newList: {
                        from: "",
                        to: "",
                        name: ""
                    }
                }));
            };

            const { from, to, name } = this.state.newList;
            return (
                <Grid container direction="column">
                    <Typography variant="headline">Neue Liste erstellen</Typography>
                    <TextField
                        onChange={this.update("name")}
                        helperText="Name"
                        value={name}
                    />
                    <TextField
                        onChange={this.update("from")}
                        value={from}
                        helperText="Ausgangssprache"
                    />
                    <TextField
                        onChange={this.update("to")}
                        helperText="Endsprache"
                        value={to}
                    />
                    <Button onClick={createList} variant="raised">
                        ERSTELLEN
                    </Button>
                </Grid>
            );
        }
    }
);

render(<StyledApp />, document.getElementById("root"));
