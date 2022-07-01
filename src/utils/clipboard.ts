export async function copy(content: string) {
  await navigator.clipboard.writeText(content);
}
