import {
  Card,
  Overlay,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

    [`&:hover .${getStylesRef("image")}`]: {
      transform: "scale(1.03)",
    },
  },

  image: {
    ...theme.fn.cover(),
    ref: getStylesRef("image"),
    backgroundSize: "cover",
    transition: "transform 500ms ease",
  },

  content: {
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 1,
  },

  title: {
    color: "white",
    fontWeight: 700,
    fontSize: rem(26),
  },

  author: {
    color: "white",
    opacity: 0.7,
  },

  category: {
    color: "white",
    opacity: 0.7,
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

export function LibrarySearchItem({
  link,
  image,
  title,
  author,
  category,
}: {
  link: string;
  image: string;
  title: string;
  author: string;
  category: string;
}) {
  const { classes } = useStyles();

  return (
    <Link href={link}>
      <Card p="xl" shadow="xl" className={classes.card}>
        <div
          className={classes.image}
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
          }}
        />
        <Overlay
          zIndex={1}
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .70) 100%)"
        />
        <div className={classes.content}>
          <Text className={classes.category} size="xs">
            {category}
          </Text>
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>
          <Text size="sm" className={classes.author}>
            {author}
          </Text>
        </div>
      </Card>
    </Link>
  );
}
