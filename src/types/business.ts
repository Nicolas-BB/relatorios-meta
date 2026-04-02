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

export type PgAccount = {
    id: string,
    name: string,
    minimum: number | null,
    balance: number,
    status: string,
    updated: string,
    type: string | null,
    show: boolean
}

export type BmLead = {
    id: string,
    bm: string,
    total: number,
}

export type LeadData = {
    id: string;
    bm: string;
    total: number;
    date: string;
}
export type Mensagem = {
    id: string,
    conta: string,
    mensagem: string,
    grupo: string,
    formato: string,
    dias_semana: string[],
    ativo: boolean
}
