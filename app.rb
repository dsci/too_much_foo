require 'sinatra'
require "sinatra/json"

configure do
  file = File.new("#{settings.root}/log/#{settings.environment}.log", 'a+')
  file.sync = true
  use Rack::CommonLogger, file
end

#set :public_folder, File.dirname(__FILE__) + '/public'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
  #File.read(File.join('public', 'index.html'))
end

get '/posts' do
  json :posts => [{"title" => "Hallo Welt!", "id" => 1}]
end

get '/posts/:id' do
  json :post => {"title" => "Hallo Welt!", "body" => "Wuzzza"}
end
