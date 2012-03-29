require 'json'
require 'time'

def human_time_for(start, stop)
  str = start.strftime("%B %d")
  str << start.strftime(" %I:%M")
  str << stop.strftime(" - %I:%M")

  str
end

def as_json(rows, opts = {})
  rows = rows.dup
  id = opts[:index] || 'id'

  data = []
  headers = rows.shift
  rows.each_with_index do |row, idx|
    row_hash = {id => idx + 1}
    row.each_with_index { |e, i| row_hash[headers[i]] = e }

    if row_hash['start_date']
      row_hash['time'] = human_time_for(Time.parse(row_hash['start_date']), Time.parse(row_hash['end_date']))
    end

    if row_hash['latitude']
      row_hash['latitude'] = Float(row_hash['latitude'])
    end

    if row_hash['longitude']
      row_hash['longitude'] = Float(row_hash['longitude'])
    end

    data << row_hash
  end

  data
end


desc 'Fetch data from the spreadsheet'
task :fetch do
  require "google_spreadsheet"
  require 'json'

  print "fetching spreadsheet..."

  user = ENV['GOOGLE_USER'] or raise "must set GOOGLE_USER"
  pass = ENV['GOOGLE_PASS'] or raise "must set GOOGLE_PASS (may be a file path)"

  passfile = File.expand_path(pass)
  pass = File.read(passfile) if File.exist?(passfile)

  sheet = GoogleSpreadsheet.login(user, pass).spreadsheet_by_key("0ApjAqinI2AJCdDE0OGN2ZzllcUtmeVRzREJDaFVzUVE")
  puts "done."

  print 'fetching rows...'
  session_rows  = sheet.worksheets[0].rows
  speaker_rows  = sheet.worksheets[1].rows
  sponsor_rows  = sheet.worksheets[2].rows
  location_rows = sheet.worksheets[3].rows
  puts 'done.'

  print 'writing json...'
  data = {
    :sessions       => as_json(session_rows, :index => 'nid'),
    :speakers       => as_json(speaker_rows, :index => 'uid'),
    :sponsors       => as_json(sponsor_rows),
    :locations      => as_json(location_rows)
  }

  File.open("data/seconf.json", "w") { |file| file << data.to_json }
  puts 'done.'
end

task :refresh => [:fetch, :upload]