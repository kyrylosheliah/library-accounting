export default function imageLoader({ src }) {
  return `${process.env.BACKEND}${src}`;
}
