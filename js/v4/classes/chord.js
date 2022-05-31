const checkNoteDistance = notes => {
  if (notes.length < 3) return notes
  const staff = {}
  notes.forEach(n => {
    if (n.staff in staff) {
      staff[n.staff].notes.push(n)
    } else {
      staff[n.staff] = {notes: [n]}
    }
  })
  let hasWideInterval = false
  Object
    .entries(staff)
    .forEach(([key, value]) => {
      staff[key].min = Math.min(...value.notes.map(n => n.midiByte))
      staff[key].max = Math.max(...value.notes.map(n => n.midiByte))
      staff[key].delta = staff[key].max - staff[key].min
      hasWideInterval = (staff[key].delta > 14)
      if (hasWideInterval) {
        staff[key].notes = staff[key].notes.filter(n => n.midiByte > staff[key].min)
      }
    })
  return Object.values(staff).map(v => v.notes).flat()
  // if (!hasWideInterval) return
  // console.log('checkNoteDistance', staff, Object.values(staff).map(v => v.notes).flat())
}

export class Chord {
  constructor(notes, tp) {
    this.x = Math.min(...notes.map(n => n.x));
    this.notes = notes;
    this.errors = 0;
    this.keys = new Set(checkNoteDistance(this.notes).map(n => n.midiByte));
    // this.keys = new Set(this.notes.map(n => n.midiByte));
    this.tp = tp;
  }
}
