export function stripPipeFromEventTitles(centerEvent) {
  return {
    ...centerEvent,
    events: centerEvent.events.map((e) => {
      const title = e.title
      return {
        ...e,
        title: title.substring(1, title.length - 1),
      }
    }),
  }
}
