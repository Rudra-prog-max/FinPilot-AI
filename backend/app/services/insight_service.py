from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def generate_insights(
    db: Session,
    user_id: int,
):

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id
        )
        .all()
    )


    if not transactions:
        return [
            {
                "message": "Start adding transactions to get AI insights."
            }
        ]


    expenses = [
        t for t in transactions
        if t.type == "expense"
    ]


    income = sum(
        t.amount
        for t in transactions
        if t.type == "income"
    )


    expense = sum(
        t.amount
        for t in expenses
    )


    insights = []


    if expenses:

        category_totals = {}

        for item in expenses:

            category_totals[item.category] = (
                category_totals.get(item.category, 0)
                + item.amount
            )


        highest_category = max(
            category_totals,
            key=category_totals.get,
        )


        insights.append(
            {
                "message":
                f"Your highest spending category is {highest_category}."
            }
        )


    insights.append(
        {
            "message":
            f"You spent ₹{expense} and earned ₹{income} so far."
        }
    )


    if income > expense:

        insights.append(
            {
                "message":
                f"Great! You saved ₹{income-expense}."
            }
        )

    else:

        insights.append(
            {
                "message":
                "Your expenses are higher than your income. Consider reducing spending."
            }
        )


    return insights