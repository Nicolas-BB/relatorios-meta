export type Business = {
    id: string,
    name: string
}

export type Paging = {
    cursors?: {
        before?: string,
        after?: string
    }
}

export type BusinessResponse = {
    data: Business[],
    paging?: Paging
}

export type AdAccounts = {
    account_id: string,
    id: string
}

export type AdAccountsResponse = {
    data: AdAccounts[]
}

export type AdAccountCoupons = {
    amount: number,
    currency: string,
    display_amout: string,
    expiration: string,
    start_date: string,
    coupon_id: string,
    original_amount: number,
    original_display_amount: string
}

export type AdAccountBalanceResponse = {
    balance: string,
    currency: string
    funding_source_details: {
        id: string
        coupons?: AdAccountCoupons[],
        display_string: string,
        type: number
    },
    name: string,
    is_prepay_account: boolean,
    id: string
}

export type AccountInfo = {
    id: string,
    name: string,
    balance: number
}
