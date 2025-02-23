export interface VancouverPoolSchedules {
  body: {
    center_events: {
      activity_detail_url: string
      end_time: string
      price: {
        estimate_price: string
      }
      start_time: string
      title: string
      event_item_id: number
    }[]
  }
}
