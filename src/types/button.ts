export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonVariant = {
    variant?: 'primary' | 'secondary'
}

export type Props = ButtonProps & ButtonVariant