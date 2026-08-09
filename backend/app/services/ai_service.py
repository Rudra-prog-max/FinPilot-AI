import re
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.budget import Budget


# ============================================================
# DATE HELPERS
# ============================================================

def get_month_range(year: int, month: int):
    start = datetime(year, month, 1)

    if month == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, month + 1, 1)

    return start, end


def get_current_month_range():
    now = datetime.now()
    return get_month_range(now.year, now.month)


def get_previous_month_range():
    now = datetime.now()

    if now.month == 1:
        year = now.year - 1
        month = 12
    else:
        year = now.year
        month = now.month - 1

    return get_month_range(year, month)


# ============================================================
# TRANSACTION PERIOD ANALYSIS
# ============================================================

def get_period_transactions(
    db: Session,
    user_id: int,
    start_date: datetime,
    end_date: datetime,
):
    return (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.created_at >= start_date,
            Transaction.created_at < end_date,
        )
        .all()
    )


def calculate_period_data(transactions):
    total_income = sum(
        t.amount
        for t in transactions
        if t.type == "income"
    )

    total_expense = sum(
        t.amount
        for t in transactions
        if t.type == "expense"
    )

    balance = total_income - total_expense

    category_totals = {}

    for transaction in transactions:
        if transaction.type == "expense":
            category = transaction.category.strip().lower()

            category_totals[category] = (
                category_totals.get(category, 0)
                + transaction.amount
            )

    expense_rate = (
        (total_expense / total_income) * 100
        if total_income > 0
        else 0
    )

    savings_rate = (
        (balance / total_income) * 100
        if total_income > 0
        else 0
    )

    top_category = None

    if category_totals:
        top_category = max(
            category_totals,
            key=category_totals.get,
        )

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "category_totals": category_totals,
        "expense_rate": expense_rate,
        "savings_rate": savings_rate,
        "top_category": top_category,
        "transaction_count": len(transactions),
    }


# ============================================================
# FINANCIAL CONTEXT
# ============================================================

def get_financial_context(
    db: Session,
    user_id: int,
) -> dict:

    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == user_id)
        .all()
    )

    total_income = sum(
        t.amount
        for t in transactions
        if t.type == "income"
    )

    total_expense = sum(
        t.amount
        for t in transactions
        if t.type == "expense"
    )

    balance = total_income - total_expense

    category_totals = {}

    for transaction in transactions:
        if transaction.type == "expense":
            category = transaction.category.strip().lower()

            category_totals[category] = (
                category_totals.get(category, 0)
                + transaction.amount
            )

    top_category = None
    lowest_category = None

    if category_totals:
        top_category = max(
            category_totals,
            key=category_totals.get,
        )

        lowest_category = min(
            category_totals,
            key=category_totals.get,
        )

    savings_rate = (
        (balance / total_income) * 100
        if total_income > 0
        else 0
    )

    expense_rate = (
        (total_expense / total_income) * 100
        if total_income > 0
        else 0
    )

    # --------------------------------------------------------
    # Current month
    # --------------------------------------------------------

    current_start, current_end = get_current_month_range()

    current_transactions = get_period_transactions(
        db,
        user_id,
        current_start,
        current_end,
    )

    current_month = calculate_period_data(
        current_transactions
    )

    # --------------------------------------------------------
    # Previous month
    # --------------------------------------------------------

    previous_start, previous_end = get_previous_month_range()

    previous_transactions = get_period_transactions(
        db,
        user_id,
        previous_start,
        previous_end,
    )

    previous_month = calculate_period_data(
        previous_transactions
    )

    # --------------------------------------------------------
    # Budget status
    # --------------------------------------------------------

    budget_status = []

    for budget in budgets:
        category = budget.category.strip().lower()

        spent = category_totals.get(
            category,
            0,
        )

        percentage = (
            (spent / budget.monthly_limit) * 100
            if budget.monthly_limit > 0
            else 0
        )

        remaining = (
            budget.monthly_limit - spent
        )

        budget_status.append({
            "category": budget.category,
            "limit": budget.monthly_limit,
            "spent": spent,
            "remaining": remaining,
            "percentage": percentage,
            "over_budget": percentage > 100,
        })

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "savings_rate": savings_rate,
        "expense_rate": expense_rate,
        "category_totals": category_totals,
        "top_category": top_category,
        "lowest_category": lowest_category,
        "budget_status": budget_status,
        "transactions": transactions,
        "current_month": current_month,
        "previous_month": previous_month,
    }


# ============================================================
# INTENT DETECTION
# ============================================================

def detect_intent(message: str) -> str:
    message = message.strip().lower()

    # --------------------------------------------------------
    # Month comparison
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "compare this month with last month",
            "compare this month to last month",
            "compare current month with last month",
            "compare current month to last month",
            "month comparison",
            "compare months",
            "monthly comparison",
            "this month vs last month",
            "this month versus last month",
        ]
    ):
        return "month_comparison"

    # --------------------------------------------------------
    # Previous month
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "last month",
            "previous month",
            "previous month's",
            "last month's",
            "how much did i spend last month",
            "how much did i earn last month",
        ]
    ):
        return "previous_month"

    # --------------------------------------------------------
    # Current month
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "this month",
            "current month",
            "so far this month",
            "this month's",
            "current month's",
        ]
    ):
        return "current_month"

    # --------------------------------------------------------
    # Affordability
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "can i afford",
            "can i afford to buy",
            "can i afford to spend",
            "do i have enough",
            "is it affordable",
            "afford",
        ]
    ):
        return "affordability"

    # --------------------------------------------------------
    # Cut spending
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "where should i cut",
            "where can i cut",
            "cut my spending",
            "cut spending",
            "reduce my spending",
            "reduce spending",
            "reduce my expenses",
            "cut my expenses",
            "where should i reduce",
            "what should i cut",
            "what expenses should i cut",
            "how can i reduce my spending",
        ]
    ):
        return "cut_spending"

    # --------------------------------------------------------
    # Budget
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "budget",
            "over budget",
            "budget limit",
            "budgeted",
            "how much can i spend",
            "how much can i still spend",
            "remaining budget",
            "budget remaining",
            "am i within my budget",
            "did i exceed my budget",
            "exceeded my budget",
            "budget status",
            "budget usage",
            "review my budget",
        ]
    ):
        return "budget"

    # --------------------------------------------------------
    # Financial health
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "financial health",
            "how are my finances",
            "how am i doing financially",
            "am i doing okay financially",
            "am i financially healthy",
            "financial situation",
            "overall finances",
            "financial status",
            "how is my financial health",
            "show my financial health",
        ]
    ):
        return "health"

    # --------------------------------------------------------
    # Savings
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "save",
            "saving",
            "savings",
            "how much should i save",
            "how can i save",
            "save more",
            "increase my savings",
            "am i saving enough",
            "saving rate",
            "savings rate",
        ]
    ):
        return "savings"

    # --------------------------------------------------------
    # Income
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "income",
            "earnings",
            "earned",
            "how much did i earn",
            "how much do i earn",
            "my income",
            "total income",
        ]
    ):
        return "income"

    # --------------------------------------------------------
    # Balance
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "balance",
            "available balance",
            "current balance",
            "how much money do i have",
            "how much money is left",
            "money left",
            "remaining money",
        ]
    ):
        return "balance"

    # --------------------------------------------------------
    # Category analysis
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "category",
            "categories",
            "breakdown",
            "biggest expense",
            "largest expense",
            "where am i spending",
            "where is my money going",
            "what am i spending the most on",
            "which category",
            "top spending",
            "most expensive category",
            "highest spending category",
            "lowest spending category",
            "least spending",
        ]
    ):
        return "categories"

    # --------------------------------------------------------
    # Spending
    # --------------------------------------------------------

    if any(
        phrase in message
        for phrase in [
            "spending",
            "expense",
            "expenses",
            "spent",
            "spend",
            "how much did i spend",
            "how much am i spending",
            "analyze my spending",
            "analyze my expenses",
            "my spending",
            "my expenses",
            "spending analysis",
            "expense analysis",
        ]
    ):
        return "spending"

    return "general"


# ============================================================
# CATEGORY DETECTION
# ============================================================

def detect_requested_category(
    message: str,
    category_totals: dict,
) -> str | None:

    message = message.lower()

    for category in category_totals:
        if category.lower() in message:
            return category.lower()

    aliases = {
        "food": [
            "food",
            "foods",
            "eating",
            "restaurant",
            "restaurants",
            "dining",
            "meal",
            "meals",
            "groceries",
            "grocery",
        ],
        "travel": [
            "travel",
            "trip",
            "trips",
            "vacation",
            "transport",
        ],
        "shopping": [
            "shopping",
            "shop",
            "clothes",
            "clothing",
        ],
        "entertainment": [
            "entertainment",
            "movies",
            "movie",
            "games",
            "gaming",
        ],
        "bills": [
            "bill",
            "bills",
            "utilities",
            "electricity",
            "internet",
            "phone",
        ],
        "health": [
            "health",
            "medical",
            "medicine",
            "medicines",
            "doctor",
        ],
    }

    for category, keywords in aliases.items():
        if category not in category_totals:
            continue

        if any(
            keyword in message
            for keyword in keywords
        ):
            return category

    return None


# ============================================================
# AMOUNT EXTRACTION
# ============================================================

def extract_amount(
    message: str,
) -> float | None:

    matches = re.findall(
        r"(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)",
        message.lower(),
    )

    if not matches:
        return None

    try:
        return float(
            matches[-1].replace(",", "")
        )
    except ValueError:
        return None


# ============================================================
# SPENDING ANALYSIS
# ============================================================

def analyze_spending(
    context: dict,
    message: str,
) -> str:

    total_income = context["total_income"]
    total_expense = context["total_expense"]
    balance = context["balance"]
    top_category = context["top_category"]

    if total_income == 0 and total_expense == 0:
        return (
            "I don't have enough transaction data yet "
            "to analyze your spending."
        )

    requested_category = detect_requested_category(
        message,
        context["category_totals"],
    )

    if requested_category:
        amount = context["category_totals"][
            requested_category
        ]

        percentage = (
            (amount / total_expense) * 100
            if total_expense > 0
            else 0
        )

        return (
            f"You've spent ₹{amount:,.0f} on "
            f"{requested_category.capitalize()}.\n\n"
            f"That represents {percentage:.1f}% "
            f"of your total expenses."
        )

    response = (
        "Here's your current spending overview:\n\n"
        f"Total income: ₹{total_income:,.0f}\n"
        f"Total expenses: ₹{total_expense:,.0f}\n"
        f"Net balance: ₹{balance:,.0f}\n"
    )

    if total_income > 0:
        response += (
            f"Expense-to-income ratio: "
            f"{context['expense_rate']:.1f}%\n"
        )

    if top_category:
        response += (
            f"\nYour highest spending category is "
            f"{top_category.capitalize()}."
        )

    return response


# ============================================================
# CURRENT MONTH
# ============================================================

def analyze_current_month(
    context: dict,
) -> str:

    data = context["current_month"]

    if data["transaction_count"] == 0:
        return (
            "I don't have any transactions recorded "
            "for this month yet."
        )

    return (
        "Here's your spending for this month so far:\n\n"
        f"Income: ₹{data['total_income']:,.0f}\n"
        f"Expenses: ₹{data['total_expense']:,.0f}\n"
        f"Balance: ₹{data['balance']:,.0f}\n"
        f"Expense-to-income ratio: "
        f"{data['expense_rate']:.1f}%\n\n"
        f"Highest spending category: "
        f"{data['top_category'].capitalize() if data['top_category'] else 'None'}"
    )


# ============================================================
# PREVIOUS MONTH
# ============================================================

def analyze_previous_month(
    context: dict,
) -> str:

    data = context["previous_month"]

    if data["transaction_count"] == 0:
        return (
            "I don't have any transactions recorded "
            "for last month yet.\n\n"
            "Add some transactions from last month "
            "to see your historical spending."
        )

    return (
        "Here's your spending from last month:\n\n"
        f"Income: ₹{data['total_income']:,.0f}\n"
        f"Expenses: ₹{data['total_expense']:,.0f}\n"
        f"Balance: ₹{data['balance']:,.0f}\n"
        f"Expense-to-income ratio: "
        f"{data['expense_rate']:.1f}%\n\n"
        f"Highest spending category: "
        f"{data['top_category'].capitalize() if data['top_category'] else 'None'}"
    )


# ============================================================
# MONTHLY COMPARISON
# ============================================================

def percentage_change(
    current: float,
    previous: float,
):
    if previous == 0:
        return None

    return (
        (current - previous)
        / previous
    ) * 100


def analyze_monthly_comparison(
    context: dict,
) -> str:

    current = context["current_month"]
    previous = context["previous_month"]

    if (
        current["transaction_count"] == 0
        and previous["transaction_count"] == 0
    ):
        return (
            "I don't have enough monthly transaction "
            "data to compare the two months."
        )

    if previous["transaction_count"] == 0:
        return (
            "I can see transactions for this month, "
            "but I don't have any transactions recorded "
            "for last month yet.\n\n"
            f"This month's expenses: "
            f"₹{current['total_expense']:,.0f}\n"
            f"This month's income: "
            f"₹{current['total_income']:,.0f}\n\n"
            "Add last month's transactions and I'll "
            "be able to compare the two periods."
        )

    current_expense = current["total_expense"]
    previous_expense = previous["total_expense"]

    current_income = current["total_income"]
    previous_income = previous["total_income"]

    current_balance = current["balance"]
    previous_balance = previous["balance"]

    expense_change = percentage_change(
        current_expense,
        previous_expense,
    )

    income_change = percentage_change(
        current_income,
        previous_income,
    )

    expense_difference = (
        current_expense - previous_expense
    )

    income_difference = (
        current_income - previous_income
    )

    balance_difference = (
        current_balance - previous_balance
    )

    response = (
        "📊 This month vs last month\n\n"
        "Expenses\n"
        f"• This month: ₹{current_expense:,.0f}\n"
        f"• Last month: ₹{previous_expense:,.0f}\n"
    )

    if expense_change is not None:
        if expense_change > 0:
            response += (
                f"• Spending increased by "
                f"{expense_change:.1f}% "
                f"(₹{expense_difference:,.0f})\n"
            )
        elif expense_change < 0:
            response += (
                f"• Spending decreased by "
                f"{abs(expense_change):.1f}% "
                f"(₹{abs(expense_difference):,.0f})\n"
            )
        else:
            response += (
                "• Spending stayed the same.\n"
            )

    response += (
        "\nIncome\n"
        f"• This month: ₹{current_income:,.0f}\n"
        f"• Last month: ₹{previous_income:,.0f}\n"
    )

    if income_change is not None:
        if income_change > 0:
            response += (
                f"• Income increased by "
                f"{income_change:.1f}%\n"
            )
        elif income_change < 0:
            response += (
                f"• Income decreased by "
                f"{abs(income_change):.1f}%\n"
            )
        else:
            response += (
                "• Income stayed the same.\n"
            )

    response += (
        "\nBalance\n"
        f"• This month: ₹{current_balance:,.0f}\n"
        f"• Last month: ₹{previous_balance:,.0f}\n"
        f"• Difference: ₹{balance_difference:,.0f}\n"
    )

    if current_expense > previous_expense:
        response += (
            "\n⚠️ You're spending more this month "
            "than you did last month."
        )
    elif current_expense < previous_expense:
        response += (
            "\n✅ You're spending less this month "
            "than you did last month."
        )
    else:
        response += (
            "\n➡️ Your spending is the same as last month."
        )

    # --------------------------------------------------------
    # Category comparison
    # --------------------------------------------------------

    current_categories = current["category_totals"]
    previous_categories = previous["category_totals"]

    all_categories = set(
        current_categories.keys()
    ).union(
        previous_categories.keys()
    )

    category_changes = []

    for category in all_categories:
        current_amount = current_categories.get(
            category,
            0,
        )

        previous_amount = previous_categories.get(
            category,
            0,
        )

        difference = (
            current_amount - previous_amount
        )

        category_changes.append(
            (
                category,
                difference,
                current_amount,
                previous_amount,
            )
        )

    category_changes.sort(
        key=lambda item: abs(item[1]),
        reverse=True,
    )

    if category_changes:
        response += "\n\nCategory changes:\n"

        for (
            category,
            difference,
            current_amount,
            previous_amount,
        ) in category_changes[:3]:

            if difference > 0:
                response += (
                    f"• {category.capitalize()}: "
                    f"₹{difference:,.0f} more\n"
                )

            elif difference < 0:
                response += (
                    f"• {category.capitalize()}: "
                    f"₹{abs(difference):,.0f} less\n"
                )

            else:
                response += (
                    f"• {category.capitalize()}: "
                    "no change\n"
                )

    return response


# ============================================================
# SAVINGS ANALYSIS
# ============================================================

def analyze_savings(
    context: dict,
) -> str:

    total_income = context["total_income"]
    total_expense = context["total_expense"]
    savings_rate = context["savings_rate"]
    balance = context["balance"]

    if total_income <= 0:
        return (
            "I don't have enough income data to "
            "calculate your savings rate yet."
        )

    response = (
        f"Your current savings rate is "
        f"{savings_rate:.1f}%.\n\n"
        f"Income: ₹{total_income:,.0f}\n"
        f"Expenses: ₹{total_expense:,.0f}\n"
        f"Current savings: ₹{balance:,.0f}\n\n"
    )

    if savings_rate >= 30:
        response += (
            "That's a strong savings rate. "
            "Keep maintaining your current "
            "spending discipline."
        )
    elif savings_rate >= 20:
        response += (
            "You're saving a healthy portion "
            "of your income. Keep building "
            "that consistency."
        )
    elif savings_rate >= 15:
        response += (
            "You're saving a reasonable portion "
            "of your income. Try to gradually "
            "increase your savings rate."
        )
    elif savings_rate > 0:
        response += (
            "You're currently saving some money, "
            "but there is room to improve. "
            "Review your largest expense categories."
        )
    else:
        response += (
            "You're currently not saving from your "
            "recorded income. Reviewing your major "
            "expenses could help improve your "
            "financial position."
        )

    if total_expense > total_income:
        response += (
            "\n\n⚠️ Your expenses currently exceed "
            "your income."
        )

    return response


# ============================================================
# FINANCIAL HEALTH
# ============================================================

def analyze_health(
    context: dict,
) -> str:

    total_income = context["total_income"]
    total_expense = context["total_expense"]
    balance = context["balance"]
    savings_rate = context["savings_rate"]

    response = (
        "Here's your financial health overview:\n\n"
        f"Income: ₹{total_income:,.0f}\n"
        f"Expenses: ₹{total_expense:,.0f}\n"
        f"Balance: ₹{balance:,.0f}\n"
        f"Savings rate: {savings_rate:.1f}%\n"
        f"Expense-to-income ratio: "
        f"{context['expense_rate']:.1f}%"
    )

    if balance < 0:
        response += (
            "\n\n⚠️ Your expenses currently exceed "
            "your income. Reducing unnecessary "
            "spending should be a priority."
        )
    elif savings_rate >= 30:
        response += (
            "\n\n✅ Excellent! Your current savings "
            "rate shows strong financial discipline."
        )
    elif savings_rate >= 15:
        response += (
            "\n\n👍 Your finances are in a reasonable "
            "position. Consider gradually increasing "
            "your savings rate."
        )
    else:
        response += (
            "\n\n⚠️ Your savings rate could be "
            "improved. Review your largest "
            "expense categories."
        )

    return response


# ============================================================
# BUDGET ANALYSIS
# ============================================================

def analyze_budget(
    context: dict,
    message: str,
) -> str:

    budget_status = context["budget_status"]

    if not budget_status:
        return (
            "You don't have any budgets configured yet.\n\n"
            "Create budgets for your spending categories "
            "to start tracking your limits."
        )

    requested_category = detect_requested_category(
        message,
        context["category_totals"],
    )

    if requested_category:
        matching_budget = next(
            (
                budget
                for budget in budget_status
                if budget["category"].strip().lower()
                == requested_category
            ),
            None,
        )

        if matching_budget:
            remaining = matching_budget["remaining"]

            if remaining > 0:
                return (
                    f"You've spent "
                    f"₹{matching_budget['spent']:,.0f} "
                    f"on {matching_budget['category']} "
                    f"out of your "
                    f"₹{matching_budget['limit']:,.0f} budget.\n\n"
                    f"💰 You can still spend "
                    f"₹{remaining:,.0f} in this category."
                )

            if remaining == 0:
                return (
                    f"You've used your entire "
                    f"₹{matching_budget['limit']:,.0f} "
                    f"{matching_budget['category']} budget.\n\n"
                    "⚠️ You have no remaining budget "
                    "for this category."
                )

            return (
                f"You've spent "
                f"₹{matching_budget['spent']:,.0f} "
                f"on {matching_budget['category']} "
                f"against a "
                f"₹{matching_budget['limit']:,.0f} budget.\n\n"
                f"⚠️ You're "
                f"₹{abs(remaining):,.0f} over budget."
            )

    response = (
        "Here's your budget overview:\n\n"
    )

    for budget in budget_status:
        status = (
            "OVER"
            if budget["over_budget"]
            else "OK"
        )

        response += (
            f"• {budget['category'].capitalize()}: "
            f"₹{budget['spent']:,.0f} / "
            f"₹{budget['limit']:,.0f} "
            f"({budget['percentage']:.1f}%) "
            f"[{status}]\n"
        )

    over_budget = [
        budget
        for budget in budget_status
        if budget["over_budget"]
    ]

    if over_budget:
        response += (
            "\n⚠️ You're over budget in: "
            + ", ".join(
                budget["category"].capitalize()
                for budget in over_budget
            )
            + "."
        )
    else:
        response += (
            "\n✅ You're currently within all "
            "configured category budgets."
        )

    return response


# ============================================================
# CATEGORY ANALYSIS
# ============================================================

def analyze_categories(
    context: dict,
    message: str,
) -> str:

    category_totals = context["category_totals"]
    total_expense = context["total_expense"]

    if not category_totals:
        return (
            "You don't have any expense data yet, "
            "so I can't provide a category breakdown."
        )

    requested_category = detect_requested_category(
        message,
        category_totals,
    )

    if requested_category:
        amount = category_totals[
            requested_category
        ]

        percentage = (
            (amount / total_expense) * 100
            if total_expense > 0
            else 0
        )

        return (
            f"You've spent ₹{amount:,.0f} on "
            f"{requested_category.capitalize()}.\n\n"
            f"That represents {percentage:.1f}% "
            f"of your total expenses."
        )

    sorted_categories = sorted(
        category_totals.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    response = (
        "Here's your spending breakdown:\n\n"
    )

    for category, amount in sorted_categories:
        percentage = (
            (amount / total_expense) * 100
            if total_expense > 0
            else 0
        )

        response += (
            f"• {category.capitalize()}: "
            f"₹{amount:,.0f} "
            f"({percentage:.1f}%)\n"
        )

    return response


# ============================================================
# AFFORDABILITY
# ============================================================

def analyze_affordability(
    context: dict,
    message: str,
) -> str:

    amount = extract_amount(message)
    balance = context["balance"]

    if amount is None:
        return (
            "Sure — I can check whether you can afford "
            "something. Just tell me the amount, "
            "for example: Can I afford ₹5000?"
        )

    if balance <= 0:
        return (
            f"Your current balance is ₹{balance:,.0f}.\n\n"
            f"⚠️ I wouldn't recommend spending "
            f"₹{amount:,.0f} right now because "
            "your available balance isn't positive."
        )

    remaining = balance - amount

    if remaining >= 0:
        return (
            f"Based on your recorded finances, "
            f"₹{amount:,.0f} fits within your current balance.\n\n"
            f"Current balance: ₹{balance:,.0f}\n"
            f"After spending: ₹{remaining:,.0f}\n\n"
            "Keep in mind that this is a simple balance "
            "check and does not account for future bills "
            "or upcoming expenses."
        )

    shortfall = abs(remaining)

    return (
        f"I wouldn't recommend spending "
        f"₹{amount:,.0f} right now.\n\n"
        f"Current balance: ₹{balance:,.0f}\n"
        f"You would be short by: ₹{shortfall:,.0f}\n\n"
        "Consider reducing the purchase or increasing "
        "your available balance first."
    )


# ============================================================
# CUT SPENDING
# ============================================================

def analyze_cut_spending(
    context: dict,
) -> str:

    category_totals = context["category_totals"]
    total_expense = context["total_expense"]

    if not category_totals:
        return (
            "I don't have enough expense data yet "
            "to recommend where you should cut spending."
        )

    sorted_categories = sorted(
        category_totals.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    response = (
        "Based on your recorded spending, "
        "I'd start by reviewing your largest "
        "expense categories.\n\n"
    )

    for index, (
        category,
        amount,
    ) in enumerate(
        sorted_categories[:3],
        start=1,
    ):
        percentage = (
            (amount / total_expense) * 100
            if total_expense > 0
            else 0
        )

        response += (
            f"{index}. "
            f"{category.capitalize()}: "
            f"₹{amount:,.0f} "
            f"({percentage:.1f}% of expenses)\n"
        )

    top_category = sorted_categories[0][0]

    response += (
        f"\n💡 I'd start by reviewing your "
        f"{top_category.capitalize()} spending. "
        "Look for non-essential purchases, recurring "
        "expenses, or areas where you can reduce "
        "without affecting your essential needs."
    )

    return response


# ============================================================
# INCOME
# ============================================================

def analyze_income(
    context: dict,
) -> str:

    total_income = context["total_income"]

    if total_income <= 0:
        return (
            "I don't have any recorded income yet."
        )

    return (
        f"Your total recorded income is "
        f"₹{total_income:,.0f}."
    )


# ============================================================
# BALANCE
# ============================================================

def analyze_balance(
    context: dict,
) -> str:

    balance = context["balance"]
    income = context["total_income"]
    expense = context["total_expense"]

    if balance > 0:
        return (
            f"Your current balance is "
            f"₹{balance:,.0f}.\n\n"
            f"Income: ₹{income:,.0f}\n"
            f"Expenses: ₹{expense:,.0f}"
        )

    if balance == 0:
        return (
            "Your current balance is ₹0.\n\n"
            f"Income: ₹{income:,.0f}\n"
            f"Expenses: ₹{expense:,.0f}"
        )

    return (
        f"Your current balance is "
        f"-₹{abs(balance):,.0f}.\n\n"
        f"Income: ₹{income:,.0f}\n"
        f"Expenses: ₹{expense:,.0f}\n\n"
        "⚠️ Your recorded expenses currently exceed "
        "your recorded income."
    )


# ============================================================
# GENERAL
# ============================================================

def general_response() -> str:

    return (
        "I can help you understand and improve your finances. "
        "Try asking me something like:\n\n"
        "• Analyze my spending\n"
        "• How much did I spend on food?\n"
        "• How much did I spend last month?\n"
        "• How much have I spent this month?\n"
        "• Compare this month with last month\n"
        "• Where am I spending the most?\n"
        "• How can I save more?\n"
        "• Am I saving enough?\n"
        "• How are my finances?\n"
        "• What is my current balance?\n"
        "• How much income did I record?\n"
        "• Am I over budget?\n"
        "• How much can I still spend on food?\n"
        "• Can I afford ₹5000?\n"
        "• Where should I cut my spending?"
    )