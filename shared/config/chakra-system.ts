import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  variants: {
    variant: {
      solid: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",
        _hover: { bg: "colorPalette.solidHover" },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "border",
        bg: "transparent",
        _hover: { bg: "bg.subtle" },
      },
    },
    size: {
      sm: { px: "8px", py: "4px", fontSize: "14px" },
      md: { px: "12px", py: "8px", fontSize: "16px" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

const badgeRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    px: "8px",
    py: "2px",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "4px",
    textTransform: "uppercase",
  },
  variants: {
    variant: {
      subtle: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
      },
    },
  },
  defaultVariants: {
    variant: "subtle",
  },
});

const eventCardSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer"],
  base: {
    root: {
      bg: "bg",
      border: "1px solid",
      borderColor: "border",
      borderRadius: "8px",
      overflow: "hidden",
    },
    header: {
      p: "16px",
      borderBottom: "1px solid",
      borderColor: "border",
      fontWeight: "600",
    },
    body: {
      p: "16px",
    },
    footer: {
      p: "16px",
      borderTop: "1px solid",
      borderColor: "border",
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
    },
  },
});

const customConfig = defineConfig({
  theme: {
    recipes: {
      button: buttonRecipe,
      badge: badgeRecipe,
    },
    slotRecipes: {
      eventCard: eventCardSlotRecipe,
    },
    tokens: {
      colors: {
        brand: {
          solid: { value: "#2b6cb0" },
          solidHover: { value: "#245c96" },
          contrast: { value: "#ffffff" },
          subtle: { value: "rgba(43, 108, 176, 0.1)" },
          fg: { value: "#2b6cb0" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { base: "#ffffff", _dark: "#0a0a0a" } },
          subtle: {
            value: {
              base: "rgba(0, 0, 0, 0.04)",
              _dark: "rgba(255, 255, 255, 0.06)",
            },
          },
        },
        fg: {
          DEFAULT: { value: { base: "#171717", _dark: "#ededed" } },
        },
        border: {
          DEFAULT: {
            value: {
              base: "rgba(23, 23, 23, 0.12)",
              _dark: "rgba(237, 237, 237, 0.12)",
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
