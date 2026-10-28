import { forwardRef, type RefObject } from "react";

import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";

export interface ITooltipProps extends ChakraTooltip.RootProps {
  disabled?: boolean;
  portalled?: boolean;
  showArrow?: boolean;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  portalRef?: RefObject<HTMLElement | null>;
}

export const Tooltip = forwardRef<HTMLDivElement, ITooltipProps>(
  function Tooltip(props, ref) {
    const {
      content,
      children,
      disabled,
      showArrow,
      portalRef,
      contentProps,
      portalled = true,
      ...rest
    } = props;

    if (disabled) return children;

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
