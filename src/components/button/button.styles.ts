import { css } from "../../lib/css";

export const styles = css`
  :host .root {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    vertical-align: middle;

    margin: 0;

    max-width: 280px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    background-color: var(--colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);

    font-family: var(--fontFamilyBase);
    outline-style: none;
  }

  :host(:hover) .root {
    background-color: var(--colorNeutralBackground1Hover);
    border-color: var(--colorNeutralStroke1Hover);
    color: var(--colorNeutralForeground1);

    cursor: pointer;
  }

  :host(:active) .root {
    background-color: var(--colorNeutralBackground1Pressed);
    border-color: var(--colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1);

    outline-style: none;
  }

  /** Block */

  :host([block]) .root {
    max-width: 100%;
    width: 100%;
  }

  /** Appearance */

  :host([appearance="outline"]) .root {
    background-color: var(--colorTransparentBackground);
  }

  :host([appearance="outline"]:hover) .root {
    background-color: var(--colorTransparentBackgroundHover);
  }

  :host([appearance="outline"]:active) .root {
    background-color: var(--colorTransparentBackgroundPressed);
  }

  :host([appearance="primary"]) .root {
    background-color: var(--colorBrandBackground);
    border-color: transparent;
    color: var(--colorNeutralForegroundOnBrand);
  }

  :host([appearance="primary"]:hover) .root {
    background-color: var(--colorBrandBackgroundHover);
    border-color: transparent;
    color: var(--colorNeutralForegroundOnBrand);
  }

  :host([appearance="primary"]:active) .root {
    background-color: var(--colorBrandBackgroundPressed);
    border-color: transparent;
    color: var(--colorNeutralForegroundOnBrand);
  }

  :host([appearance="subtle"]) .root {
    background-color: var(--colorSubtleBackground);
    border-color: transparent;
    color: var(--colorNeutralForeground2);
  }

  :host([appearance="subtle"]:hover) .root {
    background-color: var(--colorSubtleBackgroundHover);
    border-color: transparent;
    color: var(--colorNeutralForeground2BrandHover);
  }

  :host([appearance="subtle"]:active) .root {
    background-color: var(--colorSubtleBackgroundPressed);
    border-color: transparent;
    color: var(--colorNeutralForeground2BrandPressed);
  }

  :host([appearance="transparent"]) .root {
    background-color: var(--colorTransparentBackground);
    border-color: transparent;
    color: var(--colorNeutralForeground2);
  }

  :host([appearance="transparent"]:hover) .root {
    background-color: var(--colorTransparentBackgroundHover);
    border-color: transparent;
    color: var(--colorNeutralForeground2BrandHover);
  }

  :host([appearance="transparent"]:active) .root {
    background-color: var(--colorTransparentBackgroundPressed);
    border-color: transparent;
    color: var(--colorNeutralForeground2BrandPressed);
  }

  /** Size */

  :host([size="small"]) .root {
    gap: 4px;
    padding: 0 8px;

    height: 24px;
    min-width: 64px;

    border-radius: var(--borderRadiusMedium);

    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightRegular);
    line-height: var(--lineHeightBase200);
  }

  :host(:not([size])) .root,
  :host([size="medium"]) .root {
    gap: 6px;
    padding: 0 12px;

    height: 32px;
    min-width: 96px;

    border-radius: var(--borderRadiusMedium);

    font-size: var(--fontSizeBase300);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase300);
  }

  :host([size="large"]) .root {
    gap: 6px;
    padding: 0 16px;

    height: 40px;
    min-width: 96px;

    border-radius: var(--borderRadiusMedium);

    font-size: var(--fontSizeBase400);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase400);
  }
`;
