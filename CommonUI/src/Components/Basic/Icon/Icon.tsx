import React, { FunctionComponent, ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum SizeProp {
    ExtraSmall = 'xs',
    Small = 'sm',
    Regular = '1x',
    Large = 'lg',
    ExtraLarge = '3x',
}

export enum IconProp {
    File = 'file',
    User = 'user',
    Settings = 'cog',
    Notification = 'bell',
    Help = 'question',
}

export interface ComponentProps {
    icon: IconProp;
    size?: SizeProp;
}

const Icon: FunctionComponent<ComponentProps> = ({
    icon,
    size = SizeProp.Regular,
}: ComponentProps): ReactElement => {
    return (
        <span>
            <FontAwesomeIcon icon={icon} size={size} />
        </span>
    );
};

export default Icon;
