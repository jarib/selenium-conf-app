require 'json'
require 'time'

def human_time_for(start, stop)
  str = start.strftime("%B %d")
  str << start.strftime(" %I:%M")
  str << stop.strftime(" - %I:%M")

  str
end

def json_write(rows, name, opts)
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

    data << row_hash
  end

  File.open(name, "w") { |file| file << data.to_json }
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
  session_rows = sheet.worksheets[0].rows
  speaker_rows = sheet.worksheets[1].rows
  puts 'done.'

  print 'writing json...'
  json_write session_rows, 'data/sessions.json', :index => 'nid'
  json_write speaker_rows, 'data/speakers.json', :index => 'uid'
  puts 'done.'
end

task :refresh => [:fetch, :upload]