// made up for this app, intended to give what's needed to the frontend
export interface RichmondPoolSchedules {
  center_name: string
  events: {
    end_time: string
    start_time: string
    title: string
  }[]
}

// taken directly from the returned data
export interface VancouverPoolSchedules {
  body: {
    center_events: {
      center_id: number
      center_name: string
      events: {
        activity_detail_url: string
        activity_location_desc: string
        background_color: string | null
        description: string
        end_time: string
        event_item_id: number
        event_type: number
        facilities: {
          center_id: number
          center_name: string
          event_type_ids: number[]
          facility_id: number
          facility_name: string
          is_center_valid: boolean
        }[]
        instructors: {
          available_for_online_pre_booked_lessons: boolean
          avatar: string
          bio: string
          can_be_scheduled: boolean
          email: string
          first_name: string
          id: number
          is_primary_instructor: boolean
          middle_name: string
          notes: string
          phone: string
          show_instructor_online: boolean
        }[]
        online_new_activity: boolean
        price: {
          estimate_price: string
          free: boolean
          is_package: boolean
          not_allow_online_team_enroll: boolean
          prices: any[]
          private_lesson_enroll_now: string
          registration_type_prices: any[]
          search_from_price: string | null
          search_from_price_desc: string
          show_price_info_online: boolean
          simple_fee: boolean
        }
        reservation_event_type_id: number
        start_time: string
        text_color: string | null
        title: string
      }[]
      total: number
    }[]
  }
}
