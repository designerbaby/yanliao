export const reportEvent = (eventName, eventId, params='') => {
  BeaconAction.onEvent(eventId || eventName, eventName, params)
}