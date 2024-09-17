import { Card, Center, createStyles, getStylesRef, rem } from "@mantine/core";

const useStyles = createStyles(
  (theme, { backcolor }: { backcolor: string | undefined }) => ({
    card: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      height: rem(150),
      width: rem(150),
      border:
        theme.colorScheme === "dark"
          ? `${rem(1)} solid ${theme.colors.dark[6]}`
          : backcolor
          ? "none"
          : `${rem(1)} solid ${theme.colors.gray[4]}`,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : backcolor
          ? backcolor
          : theme.white,

      [`&:hover .${getStylesRef("image")}`]: {
        transform: "scale(1.03)",
      },
    },

    image: {
      ...theme.fn.cover(),
      ref: getStylesRef("image"),
      transition: "transform 500ms ease",
    },
  })
);

export function ImageButton({
  title,
  backcolor,
  link,
  image,
}: {
  title: string;
  backcolor: string | undefined;
  link: string;
  image: any;
}) {
  const { classes } = useStyles({ backcolor });

  return (
    <Card
      className={classes.card}
      title={title}
      shadow="sm"
      radius="xl"
      target="_blank"
      component="a"
      href={link}
    >
      <Center className={classes.image}>{image}</Center>
    </Card>
  );
}
