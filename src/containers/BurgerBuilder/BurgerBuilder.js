import React, { Component } from 'react';
import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(res => {
                this.setState({ ingredients: res.data });
            })
            .catch(error => {
                this.setState({ error: true });
                console.log(error.response);
            });
    };

    addIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type],
            updatedCount = oldCount + 1,
            updatedIngredients = {
                ...this.state.ingredients
            };
        updatedIngredients[type] = updatedCount;
        const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        console.log(updatedIngredients);
        updatedIngredients[type] = updatedCount;
        const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });
        this.updatePurchaseState(updatedIngredients);
    };


    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igkey => ingredients[igkey]).reduce((sum, el) => { return sum + el }, 0);
        this.setState({ purchasable: sum > 0 });
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    };

    purchaseContinueHandler = () => {


        const queryParams = [];
        Object.keys(this.state.ingredients).forEach(i => {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));

        });
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });

    };

    render() {
        const disableInfo = { ...this.state.ingredients };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientsHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice.toFixed(2)} />
        }
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux >
        );
    };
};

export default withErrorHandler(BurgerBuilder, axios);